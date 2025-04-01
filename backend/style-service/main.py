from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, Integer, String, Float, MetaData, Table, select, insert, update, delete, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

# Load environment variables
load_dotenv()

# Database configuration
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "root")
DB_NAME = os.getenv("DB_NAME", "fashion_ai")

# Create SQLAlchemy engine
DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Define models
class StylePreferenceModel(Base):
    __tablename__ = "style_profiles"
    
    profile_id = Column(Integer, primary_key=True, name="profile_id")
    user_id = Column(Integer, nullable=False, name="user_id")
    style_1 = Column(String(100), nullable=True, name="style_1")
    style_1_percentage = Column(Float, nullable=True, name="style_1_percentage")
    style_2 = Column(String(100), nullable=True, name="style_2")
    style_2_percentage = Column(Float, nullable=True, name="style_2_percentage")
    style_3 = Column(String(100), nullable=True, name="style_3")
    style_3_percentage = Column(Float, nullable=True, name="style_3_percentage")
    style_4 = Column(String(100), nullable=True, name="style_4")
    style_4_percentage = Column(Float, nullable=True, name="style_4_percentage")
    
    class Config:
        orm_mode = True

# Create tables
metadata = MetaData()
Base.metadata.create_all(bind=engine)

# Pydantic models for API
class StylePreference(BaseModel):
    style_name: str
    percentage: int

class StyleProfile(BaseModel):
    user_id: int
    preferences: List[StylePreference]

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize FastAPI app
app = FastAPI(title="Style Profile Service")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Default style profiles
DEFAULT_PROFILES = {
    1: [
        {"style_name": "Casual", "percentage": 40},
        {"style_name": "Contemporary", "percentage": 30},
        {"style_name": "Minimalist", "percentage": 20},
        {"style_name": "Streetwear", "percentage": 10}
    ],
    2: [
        {"style_name": "Professional", "percentage": 45},
        {"style_name": "Classic", "percentage": 25},
        {"style_name": "Formal", "percentage": 20},
        {"style_name": "Business Casual", "percentage": 10}
    ],
    3: [
        {"style_name": "Streetwear", "percentage": 35},
        {"style_name": "Urban", "percentage": 30},
        {"style_name": "Athleisure", "percentage": 20},
        {"style_name": "Vintage", "percentage": 15}
    ],
    "default": [
        {"style_name": "Casual", "percentage": 35},
        {"style_name": "Minimalist", "percentage": 25},
        {"style_name": "Classic", "percentage": 25},
        {"style_name": "Trendy", "percentage": 15}
    ]
}

# Initialize database with default profiles
@app.on_event("startup")
async def startup_db_client():
    db = SessionLocal()
    try:
        # Check if we need to initialize default data
        result = db.execute(select(StylePreferenceModel).limit(1)).first()
        if not result:
            print("Initializing database with default style profiles...")
            for user_id, preferences in DEFAULT_PROFILES.items():
                if user_id != "default":  # Skip the default template
                    for pref in preferences:
                        db_pref = StylePreferenceModel(
                            user_id=user_id,
                            style_1=pref["style_name"],
                            style_1_percentage=pref["percentage"]
                        )
                        db.add(db_pref)
            db.commit()
            print("Database initialized successfully!")
    except Exception as e:
        print(f"Error initializing database: {e}")
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Style Profile Service is running with MySQL"}

@app.get("/api/users/{user_id}/styles")
def get_user_style(user_id: int, db: Session = Depends(get_db)):
    print(f"Getting style profile for user: {user_id}")
    
    # Get the single row for this user
    result = db.execute(text(f"SELECT * FROM style_profiles WHERE user_id = {user_id} LIMIT 1")).fetchone()
    
    if not result:
        print(f"No profile found for user {user_id}")
        # Return default profile
        return DEFAULT_PROFILES["default"]
    
    print(f"Raw profile data: {result}")
    
    # Build the response from all style columns
    styles = []
    
    # Add style_1
    if result.style_1 and result.style_1_percentage:
        styles.append({
            "style_name": result.style_1,
            "percentage": int(result.style_1_percentage)
        })
    
    # Add style_2
    if result.style_2 and result.style_2_percentage:
        styles.append({
            "style_name": result.style_2,
            "percentage": int(result.style_2_percentage)
        })
    
    # Add style_3
    if result.style_3 and result.style_3_percentage:
        styles.append({
            "style_name": result.style_3,
            "percentage": int(result.style_3_percentage)
        })
    
    # Add style_4
    if result.style_4 and result.style_4_percentage:
        styles.append({
            "style_name": result.style_4,
            "percentage": int(result.style_4_percentage)
        })
    
    # Sort by percentage descending
    styles.sort(key=lambda x: x["percentage"], reverse=True)
    
    print(f"Returning styles: {styles}")
    return styles

@app.post("/api/users/{user_id}/styles")
def update_user_style(user_id: int, preferences: List[StylePreference], db: Session = Depends(get_db)):
    try:
        # Delete existing preferences for this user
        db.execute(delete(StylePreferenceModel).where(StylePreferenceModel.user_id == user_id))
        
        # Add new preferences
        for pref in preferences:
            db_pref = StylePreferenceModel(
                user_id=user_id,
                style_1=pref.style_name,
                style_1_percentage=pref.percentage
            )
            db.add(db_pref)
        
        db.commit()
        return {"message": "Style preferences updated successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update style preferences: {str(e)}")

@app.get("/api/styles/all")
def get_all_styles(db: Session = Depends(get_db)):
    """Get all style preferences for admin purposes"""
    preferences = db.execute(select(StylePreferenceModel)).all()
    
    # Group by user_id
    result = {}
    for pref in preferences:
        if pref.user_id not in result:
            result[pref.user_id] = []
        
        result[pref.user_id].append({
            "style_name": pref.style_1,
            "percentage": pref.style_1_percentage
        })
    
    return result

@app.get("/api/test/update/{user_id}/{style_name}/{percentage}")
def test_update_style(user_id: int, style_name: str, percentage: int, db: Session = Depends(get_db)):
    """Test endpoint to update a specific style preference"""
    try:
        # Get the user's profile
        result = db.execute(text(f"SELECT * FROM style_profiles WHERE user_id = {user_id} LIMIT 1")).fetchone()
        
        if not result:
            print(f"No profile found for user {user_id}")
            return {"error": "User profile not found"}
        
        # Find which style column has this style name
        style_column = None
        if result.style_1 == style_name:
            style_column = "style_1_percentage"
        elif result.style_2 == style_name:
            style_column = "style_2_percentage"
        elif result.style_3 == style_name:
            style_column = "style_3_percentage"
        elif result.style_4 == style_name:
            style_column = "style_4_percentage"
        
        if style_column:
            # Update the percentage for this style
            db.execute(text(f"UPDATE style_profiles SET {style_column} = {percentage} WHERE user_id = {user_id}"))
            db.commit()
            return get_user_style(user_id, db)
        else:
            return {"error": f"Style '{style_name}' not found for user {user_id}"}
    except Exception as e:
        db.rollback()
        print(f"Error updating style: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to update style preference: {str(e)}")

@app.get("/api/debug/raw-profile/{user_id}")
def get_raw_profile(user_id: int, db: Session = Depends(get_db)):
    """Debug endpoint to see raw database data"""
    try:
        # Execute raw SQL query using SQLAlchemy's text function
        result = db.execute(text(f"SELECT * FROM style_profiles WHERE user_id = {user_id}")).fetchall()
        
        # Convert to dict for JSON response
        if result:
            columns = result[0]._mapping.keys()
            data = [{col: getattr(row, col) for col in columns} for row in result]
            return {"raw_data": data}
        return {"message": "No data found"}
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/debug/tables")
def get_tables(db: Session = Depends(get_db)):
    """Debug endpoint to see all tables in the database"""
    try:
        # Get all table names
        result = db.execute(text("SHOW TABLES")).fetchall()
        tables = [row[0] for row in result]
        
        # For each table, get its structure
        table_info = {}
        for table in tables:
            columns = db.execute(text(f"DESCRIBE {table}")).fetchall()
            table_info[table] = [
                {
                    "Field": col[0],
                    "Type": col[1],
                    "Null": col[2],
                    "Key": col[3],
                    "Default": col[4],
                    "Extra": col[5]
                }
                for col in columns
            ]
        
        return {"tables": tables, "structure": table_info}
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/debug/connection")
def get_connection_info():
    """Debug endpoint to see database connection info"""
    return {
        "database": {
            "host": DB_HOST,
            "user": DB_USER,
            "database": DB_NAME
        }
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5001, reload=True) 
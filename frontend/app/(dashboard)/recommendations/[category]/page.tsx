<div className="flex items-center gap-4">
  <h1 className="text-2xl font-bold">Here are your recommendations</h1>
  <Button size="icon" variant="ghost">
    <Heart className="h-6 w-6" />
  </Button>
</div>

<div className="relative aspect-square">
  <img
    src={item.image}
    alt={item.title}
    className="w-full h-full object-contain p-2"
  />
</div> 
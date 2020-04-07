using Luxor 

words = ["worm", "grass", "cloud", "sun"]
colours = ["red", "green", "blue", "yellow"]

for word in words 
    for colour in colours
        Drawing(200, 80, string(word, "_", colour, ".png"))
        origin()
        # background(255,255,255,100) 
        sethue(colour) 
        fontsize(80)
        fontface("arial")
        text(word, halign=:center, valign=:middle)
        finish() 
    end
end



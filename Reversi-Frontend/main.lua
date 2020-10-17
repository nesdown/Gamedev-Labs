function love.load()
    -- Set up the window sizes
    love.window.setMode(480, 800, {resizable=false, vsync=false})
    
    -- Initialize a background variable
    background = love.graphics.newImage("back-deck.png")

    -- Set up functional elements (buttons)
    require "exit"
    require "restart"
    exit.load(20, 680)
    restart.load(360, 680)


    require "deck"
    -- Debug elements
    debug_x = 0
    debug_y = 0

    count_x = 0
    count_y = 0
end

function love.update(dt)

end

-- Any event of object clicking
function love.mousereleased(mx, my)
    exit.mouseaction(mx, my)
    restart.mouseaction(mx, my)
    
    -- Debugging part
    debug_x = mx
    debug_y = my

    -- Here we are getting the debug data
    count_x, count_y = deck.mousereleased(mx, my, 1)
end

function love.draw()
    -- Set a background to fill the screen
    for i = 0, love.graphics.getWidth() / background:getWidth() do
        for j = 0, love.graphics.getHeight() / background:getHeight() do
            love.graphics.draw(background, i * background:getWidth(), j * background:getHeight())
        end
    end

    -- Draw other elements
    exit.draw()
    restart.draw()

    -- Debugging Log
    love.graphics.print("X: " .. debug_x .. " Y: " .. debug_y .. " Horizontal Block Number: " .. count_x .. " Vertical Block Number: " .. count_y, 10, 10)
    love.graphics.print(math.floor(3/2), 10, 50)
end
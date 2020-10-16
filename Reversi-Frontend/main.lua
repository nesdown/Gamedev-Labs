function love.load()
    -- Set up the window sizes
    love.window.setMode(480, 800, {resizable=false, vsync=false})
    
    -- Initialize a background variable
    background = love.graphics.newImage("back-deck.png")
end

function love.update(dt)

end

function love.draw()
    -- Set a background to fill the screen
    for i = 0, love.graphics.getWidth() / background:getWidth() do
        for j = 0, love.graphics.getHeight() / background:getHeight() do
            love.graphics.draw(background, i * background:getWidth(), j * background:getHeight())
        end
    end
end
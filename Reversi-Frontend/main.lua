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
    deck.load()
    -- Debug elements
    debug_x = 0
    debug_y = 0

    count_x = 0
    count_y = 0

    require "controler"
    players_score = {2, 2}
    player_num = 1
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
    count_x, count_y = deck.mousereleased(mx, my)
    deck, player_num = controler.click(deck, mx, my, player_num)
    players_score = {controler.score(deck, 1), controler.score(deck, 2)}
end

function love.draw()
    -- Set a background to fill the screen
    for i = 0, love.graphics.getWidth() / background:getWidth() do
        for j = 0, love.graphics.getHeight() / background:getHeight() do
            love.graphics.draw(background, i * background:getWidth(), j * background:getHeight())
        end
    end

    -- Draw deck elements
    deck.draw()

    -- Draw other elements
    exit.draw()
    restart.draw()

    -- Debugging Log
    love.graphics.print("X: " .. debug_x .. " Y: " .. debug_y .. " Horizontal Block Number: " .. count_x .. " Vertical Block Number: " .. count_y, 10, 10)
    
    -- For various tests

    -- Player number
    love.graphics.print("Player: " .. player_num, 10, 50)

    -- Scores
    love.graphics.print("Score", 200, 40)
    love.graphics.print("P1: " .. players_score[1], 150, 60)
    love.graphics.print("P2: " .. players_score[2], 250, 60)

    b = controler.depth(deck, 6, 5, -1, 0, 1, false)
    if (b) then
        love.graphics.print("true", 50, 50) 
    else
        love.graphics.print("false", 50, 50)
    end
end
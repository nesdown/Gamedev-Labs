function love.load()
    -- Set up the window sizes
    love.window.setMode(480, 800, {resizable=false, vsync=false})
    
    -- Initialize a background variable
    background = love.graphics.newImage("back-deck.png")
    win_image = love.graphics.newImage("youwin.png")
    loose_image = love.graphics.newImage("youloose.png")

    red_pin_image = love.graphics.newImage("red_pin.png")
    green_pin_image = love.graphics.newImage("green_pin.png")

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
    if (restart.mouseaction(mx, my)) then
        deck.reset()
        player_num = 1
        players_score = {2, 2}
    else
        -- Here we are getting the debug data
        deck, player_num = controler.click(deck, mx, my, player_num)
        players_score = {controler.score(deck, 1), controler.score(deck, 2)}
    end
    
    -- Debugging part
    debug_x = mx
    debug_y = my

    count_x, count_y = deck.mousereleased(mx, my)
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
    if controler.canMove(deck, player_num) == false then
        love.graphics.print("GAME OVER", 200, 110)
        if players_score[1] > players_score[2] then
            love.graphics.print("Player 1 win", 200, 150)
        else
            love.graphics.print("Player 2 win", 200, 150)
        end
    end

    -- Debugging Log
    love.graphics.print("X: " .. debug_x .. " Y: " .. debug_y .. " Horizontal Block Number: " .. count_x .. " Vertical Block Number: " .. count_y, 10, 10)
    
    -- For various tests

    -- Player number
    if (player_num == 1) then
        love.graphics.print("Player: ", 10, 50)
        love.graphics.draw(red_pin_image, 30, 22, 0, 1, 1, -20, -21)
    else
        love.graphics.print("Player: ", 10, 50)
        love.graphics.draw(green_pin_image, 30, 22, 0, 1, 1, -20, -21)
    end

    -- Scores
    love.graphics.print("Score", 200, 40)
    love.graphics.print("P1: " .. players_score[1], 150, 60)
    love.graphics.print("P2: " .. players_score[2], 250, 60)
end
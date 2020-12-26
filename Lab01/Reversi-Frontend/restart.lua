-- Initializing class for restart button. Empty table is a class reference
-- Class reference is created to hook up the functions/methods.
restart = {
    x = 0, 
    y = 0
}

function restart.load(draw_x, draw_y)
    restart.x = draw_x
    restart.y = draw_y 
    restart_image = love.graphics.newImage("restart.png")
end

function restart.mouseaction(mx, my)
    if mx >= restart.x and mx < restart.x + restart_image:getWidth()
    and my >= restart.y and my < restart.y + restart_image:getHeight() then
        -- Then it will be changed to reset functionality
        love.event.quit(0)
    end
end

function restart.draw() 
    love.graphics.draw(restart_image, restart.x, restart.y)
end
-- Initializing class for exit button. Empty table is a class reference
-- Class reference is created to hook up the functions/methods.
exit = {
    x = 0, 
    y = 0
}

function exit.load(draw_x, draw_y)
    exit.x = draw_x
    exit.y = draw_y 
    exit_image = love.graphics.newImage("exit.png")
end

function exit.mouseaction(mx, my)
    if mx >= exit.x and mx < exit.x + exit_image:getWidth()
    and my >= exit.y and my < exit.y + exit_image:getHeight() then
       love.event.quit(0)
    end
end

function exit.draw() 
    love.graphics.draw(exit_image, exit.x, exit.y)
end
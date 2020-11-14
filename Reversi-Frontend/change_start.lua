change_start = {
    x = 0,
    y = 0
}

function change_start.load(x, y)
    change_start.x = x
    change_start.y = y
end

function change_start.mouseaction(mx, my)
    return mx >= change_start.x - 37 and mx <= change_start.x + 37
    and my >= change_start.y - 37 and my <= change_start.y + 37
end

function change_start.draw(player)
    love.graphics.setColor(1, 0, 0)
    love.graphics.circle("fill", change_start.x, change_start.y, 40)
    love.graphics.setColor(0, 0, 0)
    love.graphics.print("Play", change_start.x - 15, change_start.y - 22)
    love.graphics.print("next game", change_start.x - 30, change_start.y - 10)
    love.graphics.print("for player", change_start.x - 25, change_start.y + 2)
    love.graphics.print(player, change_start.x, change_start.y + 14)
    love.graphics.setColor(1, 1, 1)
end

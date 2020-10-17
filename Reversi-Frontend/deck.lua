-- First value of each element - whether the pin is placed or not
-- Second - if 1 it is red, if 2 it is green

deck = {
    {{0, 0}, {0, 0}, {0, 0}, {0, 0}, {0, 0}, {0, 0}, {0, 0}, {0, 0}},
    {{0, 0}, {0, 0}, {0, 0}, {0, 0}, {0, 0}, {0, 0}, {0, 0}, {0, 0}},
    {{0, 0}, {0, 0}, {0, 0}, {0, 0}, {0, 0}, {0, 0}, {0, 0}, {0, 0}},
    {{0, 0}, {0, 0}, {0, 0}, {1, 2}, {1, 1}, {0, 0}, {0, 0}, {0, 0}},
    {{0, 0}, {0, 0}, {0, 0}, {1, 1}, {1, 2}, {0, 0}, {0, 0}, {0, 0}},
    {{0, 0}, {0, 0}, {0, 0}, {0, 0}, {0, 0}, {0, 0}, {0, 0}, {0, 0}},
    {{0, 0}, {0, 0}, {0, 0}, {0, 0}, {0, 0}, {0, 0}, {0, 0}, {0, 0}},
    {{0, 0}, {0, 0}, {0, 0}, {0, 0}, {0, 0}, {0, 0}, {0, 0}, {0, 0}},
}

function deck.load()
    red_pin_image = love.graphics.newImage("red_pin.png")
    green_pin_image = love.graphics.newImage("green_pin.png")
end 

-- This function determines which is a number of a pressed block on 8x8
function deck.mousereleased(mx, my)
    count_x, count_y = math.floor((mx - 75) / 42) + 1, math.floor((my - 220) / 42) + 1
    return count_x, count_y
end

function deck.draw()
    for i = 1, 8 do
        for j = 1, 8 do
            if (deck[j][i][1] == 1) then 
                if (deck[j][i][2] == 1) then
                    love.graphics.draw(red_pin_image, 75 + ((j-1)*42) - 21, 220 + ((i-1)*42) - 21 + i, 0, 1, 1, -20, -21)
                else 
                    love.graphics.draw(green_pin_image, 75 + ((j-1)*42) - 21, 220 + ((i-1)*42) - 21 + i, 0, 1, 1, -20, -21)
                end 
            end
        end 
    end
end
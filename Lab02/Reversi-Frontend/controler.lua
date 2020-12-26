controler = {}

function controler.click(deck, mx, my, player_num)
    count_x, count_y = deck.mousereleased(mx, my)
    if (count_x > 0 and count_x < 9 and count_y > 0 and count_y < 9) then
        if (deck[count_x][count_y][1] == 0) then
            stepdone = false
            deck, stepdone = controler.drawdimension(deck, count_x, count_y, 1, 0, player_num, stepdone)
            deck, stepdone = controler.drawdimension(deck, count_x, count_y, 1, 1, player_num, stepdone)
            deck, stepdone = controler.drawdimension(deck, count_x, count_y, 0, 1, player_num, stepdone)
            deck, stepdone = controler.drawdimension(deck, count_x, count_y, -1, 1, player_num, stepdone)
            deck, stepdone = controler.drawdimension(deck, count_x, count_y, -1, 0, player_num, stepdone)
            deck, stepdone = controler.drawdimension(deck, count_x, count_y, -1, -1, player_num, stepdone)
            deck, stepdone = controler.drawdimension(deck, count_x, count_y, 0, -1, player_num, stepdone)
            deck, stepdone = controler.drawdimension(deck, count_x, count_y, 1, -1, player_num, stepdone)
            if (stepdone) then
                deck[count_x][count_y] = {1, player_num}
                player_num = 3 - player_num
            end
        end
    end
    return deck, player_num
end

function controler.score(deck, player_num)
    score = 0
    for i = 1, 8 do
        for j = 1, 8 do
            if (deck[i][j][2] == player_num) then
                score = score + 1
            end
        end
    end
    return score
end

function controler.depth(deck, count_x, count_y, dx, dy, player_num, draw)
    step = 0
    while (count_x + dx < 9 and count_x + dx > 0 and count_y + dy < 9 and count_y + dy > 0) do
        deckel = deck[count_x + dx][count_y + dy]
        if (deckel[1] == 1 and deckel[2] == 3 - player_num) then
            if (draw) then
                deck[count_x + dx][count_y + dy] = {1, player_num}
            end
            step = step + 1
        elseif (deckel[1] == 1 and deckel[2] == player_num) then
            if (draw) then
                return deck
            else
                return (step > 0)
            end
        else
            return false
        end
        count_x = count_x + dx
        count_y = count_y + dy
    end
    return false
end

function controler.drawdimension(deck, count_x, count_y, dx, dy, player_num, stepdone)
    if (controler.depth(deck, count_x, count_y, dx, dy, player_num, false)) then
        return controler.depth(deck, count_x, count_y, dx, dy, player_num, true), true
    else
        return deck, false or stepdone
    end
end

function controler.depth8(deck, count_x, count_y, player_num)
    for i = -1, 1 do
        for j = -1, 1 do
            -- if (i != 0 and j != 0) then
                if controler.depth(deck, count_x, count_y, i, j, player_num, false) then
                    return true
                end
            -- end
        end
    end
    return false
end

function controler.canMove(deck, player_num)
    for i = 1, 8 do
        for j = 1, 8 do
            if deck[i][j][1] == 0 then
                if controler.depth8(deck, i, j, player_num) then
                    return true
                end
            end
        end
    end
    return false
end

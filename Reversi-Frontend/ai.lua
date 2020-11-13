ai = {}
require "controler"

function ai.heuristic(deck, player_num)
    local opponent = 1
    if player_num == 1 then
        opponent = 2
    end
    local ourScore = controler.score(deck, player_num)
    local opponentScore = controler.score(deck, opponent)
    return ourScore - opponentScore
end

function ai.getMoveList(deck, player_num)
    local moveList = {}
    for i = 1, 8 do
        for j = 1, 8 do
            if deck[i][j][1] == 0 then
                if controler.depth8(deck, i, j, player_num) then
                    moveList[#moveList + 1] = {i, j}
                end
            end
        end
    end
    return moveList
end

function ai.copyDeck(deck)
    local cpdeck = {}
    for i = 1, #deck
    do
        local cpline = {}
        for j = 1, #deck[i]
        do
            cpline[#cpline + 1] = {deck[i][j][1], deck[i][j][2]}
        end
        cpdeck[#cpdeck + 1] = cpline
    end
    return cpdeck
end

function ai.makeMove(deck, x, y, player)
    for i = -1, 1
    do
        local s = false
        for j = -1, 1 
        do
            deck, s = controler.drawdimension(deck, x, y, i, j, player, s)
        end
        if s 
        then
            deck[x][y] = {1, player}
        end
    end
    return deck
end

function ai.minimaxValue(deck, player, currentPlayer, depth)
    if (depth == 0 or controler.canMove(deck, currentPlayer) == false) then
        return ai.heuristic(deck, player)
    end

    local opponent = 1
    if currentPlayer == 1 then 
        opponent = 2
    end
    local moveList = ai.getMoveList(deck, currentPlayer)

    if #moveList == 0 then
        return ai.minimaxValue(deck, player, opponent, depth - 1)
    else
        local bestMoveValue = -100
        if player ~= currentPlayer 
        then
            bestMoveValue = 100
        end

        for i = 1, #moveList
        do
            local tempdeck = ai.copyDeck(deck)
            tempdeck = ai.makeMove(tempdeck, moveList[i][1], moveList[i][2], currentPlayer)
            local value = ai.minimaxValue(tempdeck, player, opponent, depth - 1)

            if player == currentPlayer 
            then
                if value > bestMoveValue
                then
                    bestMoveValue = value
                end
            else
                if value < bestMoveValue
                then
                    bestMoveValue = value
                end
            end
        end
        return bestMoveValue
    end
    return -1
end

function ai.minimaxDecision(deck, player)
    local x = -1
    local y = -1
    local opponent = 1
    if player == 1 then 
        opponent = 2
    end
    local moveList = ai.getMoveList(deck, player)

    if #moveList == 0
    then
        return x, y
    else
        local bestMoveValue = -100
        x = moveList[1][1]
        y = moveList[1][2]
        for i = 1, #moveList
        do
            local tempdeck = ai.copyDeck(deck)
            tempdeck = ai.makeMove(tempdeck, moveList[i][1], moveList[i][2], player)
            local value = ai.minimaxValue(tempdeck, player, opponent, 3)
            if value > bestMoveValue
            then
                bestMoveValue = value
                x = moveList[i][1]
                y = moveList[i][2]
            end
        end
        return x, y
    end
end

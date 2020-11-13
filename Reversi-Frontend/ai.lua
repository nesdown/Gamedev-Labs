ai = {}
require "controler"

function ai.score(deck)
    local score1 = 0
    local score2 = 0
    for i = 1, 8
    do
        for j = 1, 8
        do
            if deck[i][j][2] == 1
            then
                if i > 2 and i < 7 and j > 2 and j < 7
                then
                    score1 = score1 + 7
                elseif i % 7 == 1 and j % 7 ~= 1 or i % 7 ~= 1 and j % 7 == 1
                then
                    score1 = score1 + 30
                elseif i % 7 == 1 and j % 7 == 1
                then
                    score1 = score1 + 200
                else
                    score1 = score1 + 1
                end
            end
            if deck[i][j][2] == 2
            then
                if i > 2 and i < 7 and j > 2 and j < 7
                then
                    score2 = score2 + 7
                elseif i % 7 == 1 and j % 7 ~= 1 or i % 7 ~= 1 and j % 7 == 1
                then
                    score2 = score2 + 30
                elseif i % 7 == 1 and j % 7 == 1
                then
                    score2 = score2 + 200
                else
                    score2 = score2 + 1
                end
            end
        end
    end
    return score1, score2
end

function ai.heuristic(deck, player_num)
    local score1 = -1
    local score2 = -1
    score1, score2 = ai.score(deck)
    if player_num == 1
    then
        return score1 - score2
    else
        return score2 - score1
    end
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
    local s = false
    for i = -1, 1
    do
        for j = -1, 1 
        do
            deck, s = controler.drawdimension(deck, x, y, i, j, player, s)
        end
    end
    if s 
    then
        deck[x][y] = {1, player}
    end
    return deck
end

function ai.minimaxValue(deck, player, currentPlayer, depth, alpha, beta)
    if (depth == 0 or controler.canMove(deck, currentPlayer) == false) then
        return ai.heuristic(deck, player)
    end

    local opponent = 1
    if currentPlayer == 1 then 
        opponent = 2
    end
    local moveList = ai.getMoveList(deck, currentPlayer)

    if #moveList == 0 then
        return ai.minimaxValue(deck, player, opponent, depth - 1, alpha, beta)
    else
        local bestMoveValue = -9999
        if player ~= currentPlayer 
        then
            bestMoveValue = 9999
        end

        for i = 1, #moveList
        do
            local tempdeck = ai.copyDeck(deck)
            tempdeck = ai.makeMove(tempdeck, moveList[i][1], moveList[i][2], currentPlayer)
            local value = ai.minimaxValue(tempdeck, player, opponent, depth - 1, alpha, beta)

            if player == currentPlayer 
            then
                local bestMaxValue = -9999
                if value > bestMaxValue
                then
                    bestMaxValue = value
                end
                if alpha < bestMaxValue
                then
                    alpha = bestMaxValue
                end
                if alpha >= beta
                then
                    return alpha
                end

                if value > bestMoveValue
                then
                    bestMoveValue = value
                end
            else
                local bestMinValue = 9999
                if value < bestMinValue
                then
                    bestMinValue = value
                end
                if beta > bestMinValue
                then
                    beta = bestMinValue
                end
                if alpha >= beta
                then
                    return beta
                end

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
    local opponent = 1
    if player == 1 then 
        opponent = 2
    end
    local moveList = ai.getMoveList(deck, player)
    local bestValuesNum = 0
    local bestValuesArr = {}

    if #moveList == 0
    then
        return -1, -1
    else
        local bestMoveValue = -9999
        for i = 1, #moveList
        do
            local tempdeck = ai.copyDeck(deck)
            tempdeck = ai.makeMove(tempdeck, moveList[i][1], moveList[i][2], player)
            local value = ai.minimaxValue(tempdeck, player, opponent, 4, -9999, 9999)
            bestValuesArr[#bestValuesArr + 1] = value
            if value > bestMoveValue
            then
                bestMoveValue = value
                bestValuesNum = 1
            elseif value == bestMoveValue
            then
                bestValuesNum = bestValuesNum + 1
            end
        end
        local randBestMove = math.random(1, bestValuesNum)
        for i = 1, #bestValuesArr
        do
            if bestValuesArr[i] == bestMoveValue
            then
                randBestMove = randBestMove - 1
            end
            if randBestMove == 0
            then
                return moveList[i][1], moveList[i][2]
            end
        end
    end
end

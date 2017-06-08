CELL_SIZE = 4

def calculate_move(diff, positiveMoveName, negativeMoveName):
    if abs(diff) >= CELL_SIZE:
        return positiveMoveName if diff > 0 else negativeMoveName
    else:
        return None

def path_to_moves(path):
    origin = path[0]
    moves = []

    for x, y in path:
        # print x, y
        diffX = origin[0] - x
        diffY = origin[1] - y
        moveX = calculate_move(diffX, "moveLeft", "moveRight")
        moveY = calculate_move(diffY, "moveUp", "moveDown")

        # move = moveX or moveY
        if moveX:
            origin = (x, origin[1])
            print origin
            print moveX
            moves.append(moveX)

        if moveY:
            origin = (origin[0], y)
            print origin
            print moveY
            moves.append(moveY)

    return moves

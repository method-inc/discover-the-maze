CELL_SIZE = 3

def calculate_move(current_val, origin_val, previous_move, negative_move, positive_move):
    delta = current_val - origin_val
    abs_delta = abs(delta)
    move = None

    if abs_delta > 0:
        _move = positive_move if delta > 0 else negative_move

        if previous_move and _move != previous_move:
            move = _move
        elif abs_delta >= CELL_SIZE:
            move = _move

    return (move, move or previous_move)

def path_to_moves(path):
    origin = (0, 0)
    previous_lateral_move = None
    previous_vertical_move = None
    moves = []

    for x, y in path:
        (origin_x, origin_y) = origin
        (lateral_move, previous_lateral_move) = calculate_move(x, origin_x, previous_lateral_move, "moveLeft", "moveRight")
        (vertical_move, previous_vertical_move) = calculate_move(y, origin_y, previous_vertical_move, "moveUp", "moveDown")

        move = lateral_move or vertical_move

        if move:
            moves.append(move)
            origin = (x if lateral_move else origin_x, y if vertical_move else origin_y)

    return moves

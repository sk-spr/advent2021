const variables = require("./variables.js")
//day 1 part 1
//find the number of instances of f(x+1) > f(x)
function depthchange(depths){
    let num = 0
    //iterate over depths, ignore first element because no previous to compare with
    for(let i = 1; i < depths.length; i++){
        if(depths[i] > depths[i-1]){
            num += 1
        }
    }
    return num
}
// day 1 part 2
//find the number of instances of an increase in the rolling average over a list of numbers
function rolling_depthchange(depths){
    //slightly confusing task, I think I got it (example inputs check out)
    let num = 0
    let rollingsums = []
    for(let i = 2; i < depths.length; i++){
        rollingsums.push(depths[i] + depths[i-1] + depths[i-2])
    }
    return depthchange(rollingsums)
}
//day 2
//find the product of the submarine's final horizontal and vertical position
function final_steering(commands){
    let final_h = 0
    let final_v = 0
    for(let i = 0; i < commands.length; i++){
        let parts = commands[i].split(" ")
        let num = parseInt(parts[1])
        if(parts[0] == "forward")
            final_h += num
        if(parts[0] == "up")
            final_v -= num
        if(parts[0] == "down")
            final_v += num
    }
    return final_h * final_v
}
function aim_steering(commands){
    let final_h = 0
    let final_v = 0
    let aim = 0
    for(let i = 0; i < commands.length; i++){
        let parts = commands[i].split(" ")
        let num = parseInt(parts[1])
        if(parts[0] == "forward"){
            final_h += num
            final_v += num * aim
        }
        if(parts[0] == "up")
            aim -= num
        if(parts[0] == "down")
            aim += num
    }
    return final_h * final_v
}
//day 3
//part 1
//find the gamma value using the diagnostic results
function diag_01(diag){
    let gammastr = ""
    let epsilonstr = ""
    for(let digit = 0; digit < diag[0].length; digit++){
        let zero_tally = 0
        let one_tally = 0
        for(let i = 0; i < diag.length; i++){
            if(diag[i][digit] == '0')
                zero_tally++
            else one_tally++
        }
        gammastr += (zero_tally > one_tally) ? "0" : "1"
        epsilonstr += (zero_tally > one_tally) ? "1" : "0"
    }
    return parseInt(gammastr, 2) * parseInt(epsilonstr, 2)
}
//part 2
//find the life support rating using the diagnostic results
function life_support(diag){
    //TODO: refactor this to avoid repeating code
    let oxylist = diag
    let oxydig = 0
    while(oxylist.length > 1){
        // find most common digit
        let onefirst = oxylist.filter(v => (v[oxydig] == "1"))
        if(onefirst.length >= oxylist.length / 2)
            oxylist = onefirst
        else 
            oxylist = oxylist.filter(v => (v[oxydig] == "0"))
        oxydig++
    }
    let co2list = diag
    let co2dig = 0
    while(co2list.length > 1){
        let zerofirst = co2list.filter(v => v[co2dig] == "0")
        if(zerofirst.length <= co2list.length/2)
            co2list = zerofirst
        else
            co2list = co2list.filter(v => v[co2dig] == "1")
        co2dig++
    }
    return parseInt(oxylist[0], 2) * parseInt(co2list[0], 2)
}
//day 4
//part 1
//given a series of numbers and a series of bingo boards, predict which will win first
function bingo(nums, boards, predicate){
    //suboptimal solution
    let numturns = []
    let lastnums = []
    let lastboards = []
    boards.forEach(board => {
        let turns = -1
        let markedboard = [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]]
        while(!eval_bingo(markedboard) && turns < nums.length){
            turns++
            for(let y = 0; y < board.length; y++){
                for(let x = 0; x < board[y].length; x++){
                    if(board[y][x] == nums[turns]) markedboard[y][x]++
                }
            }
        }
        numturns.push(turns)
        lastnums.push(nums[turns])
        lastboards.push(markedboard)

    })
    let index = numturns.indexOf(numturns.slice().sort((a,b) => predicate(a,b))[0])
    return score_bingo(boards[index],lastboards[index]) * lastnums[index]
}
//evaluate a marked board for bingo win condition
function eval_bingo(board){
    //rows
    for(let i = 0; i < 5; i++){
        let count = board[i].filter((value) => value > 0).length
        if(count > 4) return true
    }
    //cols
    for(let i = 0; i < 5; i++){
        let count = 0
        for(let j = 0; j < 5; j++)
            count += (board[j][i] > 0) ? 1 : 0
        if(count > 4) return true
    }
    return false
}
//score a marked board against the original
function score_bingo(board, marked){
    let score = 0
    for(let y = 0; y < board.length; y++){
        for(let x = 0; x < board[y].length; x++){
            if(marked[y][x] == 0) score += board[y][x]
        }
    }
    return score
}
//day 5
//part 1
//determine the number of crossings given a list of vectors
function vent_crossings(vectors, onlyhorver){
    //determine field size
    let max_x = 0
    let max_y = 0
    for(let i = 0; i < vectors.length; i++){
        for(let j = 0; j < 2; j++){
            if(vectors[i][j][0] > max_x) max_x = vectors[i][j][0]
            if(vectors[i][j][1] > max_y) max_y = vectors[i][j][1]
        }
    }
    let field = []
    for(let y = 0; y <= max_y; y++){
        field.push([])
        for(let x = 0; x <= max_x; x++)
            field[y][x] = 0
    }
    //mark vectors in the field
    vectors.forEach(vec => {
        let x1 = vec[0][0]
        let x2 = vec[1][0]
        let y1 = vec[0][1]
        let y2 = vec[1][1]

        let magnitude = Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1))
        let directionx = Math.round((x2-x1) / magnitude)
        let directiony = Math.round((y2-y1) / magnitude)
        let x = x1
        let y = y1
        if((onlyhorver && ((directionx != 0 && directiony ==0) || (directionx == 0 && directiony != 0))) || !onlyhorver){
            while(squaredist(x, y, x2, y2) >=1){
                field[y][x]++
                x += directionx
                y += directiony
            }
            field[y][x]++
        }
        
    })
    //find how many points are greater than one
    let crossings = 0
    for(let y = 0; y < field.length; y++)
        for(let x = 0; x < field[0].length; x++)
            if(field[y][x] > 1) crossings++
    return crossings
}
function squaredist(x1, y1, x2, y2){
    return (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1)
}
// run tests
//day 1
console.log("tests:")
console.log("day 1")
console.log(depthchange(variables.inputs1))
console.log("day 1 part 2")
console.log(rolling_depthchange(variables.inputs1))
console.log("day 2")
console.log(final_steering(variables.inputs2))
console.log("day 2 part 2")
console.log(aim_steering(variables.inputs2))
console.log("day 3")
console.log(diag_01(variables.inputs3))
console.log("day 3 part 2")
console.log(life_support(variables.inputs3))
console.log("day 4")
console.log(bingo(variables.inputs4_nums, variables.inputs4_boards, (a,b) => a-b))
console.log("day 4 part 2")
console.log(bingo(variables.inputs4_nums, variables.inputs4_boards, (a,b) => b-a))
console.log("day 5")
console.log(vent_crossings(variables.inputs5, true))
console.log("day 5 part 2")
console.log(vent_crossings(variables.inputs5, false))
console.log("day 6")
console.log("placeholder")
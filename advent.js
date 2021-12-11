const variables = require("./variables.js")
const {factorial} = require("mathjs")
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
//day 6
//part 1
//given a list of lanternfish timers, simulate the number of lanternfish after n days
function lanternfish(fish, n){
    let f = fish
    for(let day = 0; day < n; day++){
        let next = f
        for(let i = 0; i < f.length; i++){
            f[i]--
            if(f[i] < 0){
                next.push(9)
                next[i] = 6
            }
        }
        f = next
    }
    return f.length
}
function lanternfish_approx(initial, days){
    return 0
}
//day 7
//part 1
//calculate horizontal position with least fuel needed to align all crab submarines
function crab_subs(crabs, tri){
    let max = 0
    for(let i = 0; i < crabs.length; i++) if(crabs[i]>max) max = crabs[i]
    let positions = []
    for(let i = 0; i <= max; i++){
        let fueltotal = 0
        for(let c = 0; c < crabs.length; c++)
            fueltotal += (tri) ? triangular(Math.abs(crabs[c] - i)) : Math.abs(crabs[c] - i)
        positions.push(fueltotal)
    }
    return positions.slice().sort((a,b) => (a-b))[0]
}
//compute the nth triangular number
function triangular(n){
    return (n*(n+1))/2
}
//day 9
//part 1
//find the local low points of the playfield
function low_points(field){
    let field_dest = []
    for(let i = 0; i < field.length; i++){
        field_dest.push([])
        for(let j = 0; j < field[0].length; j++){
            field_dest[i].push(parseInt(field[i].substring(j,j+1)))
        }
    }
    let minima = []
    for(let y = 0; y < field_dest.length; y++){
        for(let x = 0; x < field_dest[0].length; x++){
            let left = (x>0) ? field_dest[y][x-1] : 10
            let right = (x<field_dest[0].length-1) ? field_dest[y][x+1] : 10
            let up = (y>0) ? field_dest[y-1][x] : 10
            let down = (y<field_dest.length - 1) ? field_dest[y+1][x] : 10
            if(field_dest[y][x] < up && field_dest[y][x] < down && field_dest[y][x] < left && field_dest[y][x] < right) minima.push(field_dest[y][x])
        }
    }
    let score = 0
    minima.forEach(min => score += min + 1)
    return score
}
//day 10
//part 1
let closers = {"(":")","<":">","[":"]","{":"}"}
let openers = {")":"(",">":"<","]":"[","}":"{"}

//find the first bracket match error per line, score them according to the task
function bracket_error_single(string){
    let score = 0
    let open_stack = []
    for(let c = 0; c < string.length; c++){
        let current = string.substring(c, c+1)
        if(current == "(" || current == "<"|| current == "[" | current == "{"){
            open_stack.push(current)
        } else if(current == ")" || current == ">"|| current == "]" | current == "}"){
            if(open_stack[open_stack.length - 1] == openers[current])
                open_stack.pop()
            else{
                if(current == ")") score += 3
                if(current == "]") score += 57
                if(current == "}") score += 1197
                if(current == ">") score += 25137
                return [score, open_stack]
            }
        }
    }
    return [score, open_stack]
}

function bracket_errors(strings){
    let score = 0
    let completescores = []
    for(let i = 0; i < strings.length; i++){
        let s = bracket_error_single(strings[i])
        if(s[0] > 0) score += s[0]
        else {
            completescores.push([])
            let stack = s[1]
            while(stack.length > 0){
                completescores[completescores.length -1] *= 5
                if(stack[stack.length - 1] == "(") completescores[completescores.length - 1]++
                if(stack[stack.length - 1] == "[") completescores[completescores.length - 1] += 2
                if(stack[stack.length - 1] == "{") completescores[completescores.length - 1] += 3
                if(stack[stack.length - 1] == "<") completescores[completescores.length - 1] += 4
                stack.pop()
            }
        
        }
    }

    completescores.sort((a,b)=> a-b)
    let completescore = completescores[completescores.length / 2 - 0.5]
    return [score, completescore]
}

function bracket_error(strings){return bracket_errors(strings)[0]}
function bracket_complete(strings){return bracket_errors(strings)[1]}
// run tests
//day 1
console.log("tests:")
console.log("day 1")
//console.log(depthchange(variables.inputs1))
console.log("day 1 part 2")
//console.log(rolling_depthchange(variables.inputs1))
console.log("day 2")
//console.log(final_steering(variables.inputs2))
console.log("day 2 part 2")
//console.log(aim_steering(variables.inputs2))
console.log("day 3")
//console.log(diag_01(variables.inputs3))
console.log("day 3 part 2")
//console.log(life_support(variables.inputs3))
console.log("day 4")
//console.log(bingo(variables.inputs4_nums, variables.inputs4_boards, (a,b) => a-b))
console.log("day 4 part 2")
//console.log(bingo(variables.inputs4_nums, variables.inputs4_boards, (a,b) => b-a))
console.log("day 5")
//console.log(vent_crossings(variables.inputs5, true))
console.log("day 5 part 2")
//console.log(vent_crossings(variables.inputs5, false))
console.log("day 6")
//console.log(lanternfish(variables.inputs6, 80))
console.log("day 6 part 2")
//console.log(lanternfish_approx(variables.inputs6, 256))
console.log("day 7")
console.log(crab_subs(variables.inputs7, false))
console.log("day 7 part 2")
console.log(crab_subs(variables.inputs7, true))
console.log("day 9")
console.log(low_points(variables.inputs9))
console.log("day 10")
console.log(bracket_error(variables.inputs10))
console.log("day 10 part 2")
console.log(bracket_complete(variables.inputs10))
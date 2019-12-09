let serialConnected = false
let left = 0
let right = 0
let setupCount = 1
let positions: string[] = []
let targetedPositions: string[] = []
let round = ""
let isStarted = false

basic.showString("P1")
basic.pause(200)

while (!(serialConnected)) {
    serial.writeLine("request connection")

    basic.showIcon(IconNames.Target)
    basic.pause(100)
}

basic.pause(200)
basic.showIcon(IconNames.Yes)
basic.pause(200)
basic.showString("Setup")
basic.pause(200)
round = "SETUP"

led.plot(0, 0)

serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    let data = serial.readLine().split(" ")

    if (serial.readLine() === "connection accepted") {
        serialConnected = true

    } else if (serial.readLine() === "turn") {
        round = "ATTACK"
        right = 0
        left = 0
        basic.clearScreen()

        for (let i = 0; i < targetedPositions.length; i++) {
            let pos = targetedPositions.get(i)
            let posArray = pos.split(".");

            led.plot(parseInt(posArray[0]), parseInt(posArray[1]))
        }

    } else if (data[0] === "watch") {
        round = "WATCH"

        let locationString = data[1]
        let locationArray = locationString.split("-")

        locationArray.splice(0, 1)

        for (let i = 0; i < locationArray.length; i++) {
            let pos = locationArray.get(i)
            let posArray = pos.split(".");

            led.plot(parseInt(posArray[0]), parseInt(posArray[1]))
        }

    } else if (data[0] === "remove-ship") {
        let pos = data[1] + "." + data[2]
        let index = positions.indexOf(pos)

        if (index >= 0) {
            positions.splice(index, 1)
        }

    } else if (data[0] === "win") {
        basic.showString(data[1] + " wins")
    }
})
input.onButtonPressed(Button.AB, function () {
    if (round === "SETUP") {
        if (positions.indexOf(right.toString() + "." + left.toString()) >= 0) {
            serial.writeLine(`add_location ${right} ${left}`);

            positions.push(right.toString() + "." + left.toString())
            setupCount++
        }

        if (setupCount === 6) {
            serial.writeLine("ready")

            while (!isStarted) {
                basic.showIcon(IconNames.Yes)
            }
        }
    
    } else if (round === "ATTACK") {
        if (!(targetedPositions.indexOf(right.toString() + "." + left.toString()) >= 0)) {
            targetedPositions.join("" + right.toString() + "." + left.toString())

            serial.writeLine("target " + right.toString() + " " + left.toString())
        }
    }
})
input.onButtonPressed(Button.A, function () {
    if (round === "SETUP") {
        basic.clearScreen()

        for (let i = 0; i < positions.length; i++) {
            let pos = positions.get(i)
            let posArray = pos.split(".");

            led.plot(parseInt(posArray[0]), parseInt(posArray[1]))
        }

        if (left == 4) {
            left = 0
        } else {
            left += 1
        }

        led.plot(right, left)

    } else if (round === "ATTACK") {
        basic.clearScreen()

        for (let i = 0; i < targetedPositions.length; i++) {
            let pos = targetedPositions.get(i)
            let posArray = pos.split(".");

            led.plot(parseInt(posArray[0]), parseInt(posArray[1]))
        }

        if (left == 4) {
            left = 0
        } else {
            left += 1
        }

        led.plot(right, left)
    }
})

input.onButtonPressed(Button.B, function () {
    if (round === "SETUP") {
        basic.clearScreen()

        for (let i = 0; i < positions.length; i++) {
            let pos = positions.get(i)
            let posArray = pos.split(".")

            led.plot(parseInt(posArray[0]), parseInt(posArray[1]))
        }

        if (right == 4) {
            right = 0
        } else {
            right += 1
        }

        led.plot(right, left)

    } else if (round === "ATTACK") {
        basic.clearScreen()

        for (let i = 0; i < targetedPositions.length; i++) {
            let pos = targetedPositions.get(i)
            let posArray = pos.split(".")

            led.plot(parseInt(posArray[0]), parseInt(posArray[1]))
        }

        if (right == 4) {
            right = 0
        } else {
            right += 1
        }

        led.plot(right, left)
    }
})

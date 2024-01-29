import * as readlineSync from "readline-sync";

class Game {
    private playerHealth: number;
    private monsterHealth: number;
    private isGameOver: boolean;
    private turnCount: number;

    constructor() {
        this.playerHealth = 100;
        this.monsterHealth = 100;
        this.isGameOver = false;
        this.turnCount = 1;
    }

    public start(): void {
        console.log("Witaj w grze Monster Slayer!");
        while (!this.isGameOver) {
            console.log(`----- Tura ${this.turnCount} -----`);
            this.playerTurn();
            if (this.checkGameOver()) break;

            this.monsterTurn();
            if (this.checkGameOver()) break;

            this.turnCount++
        }

        this.displayWinner();
        this.askForNewGame();
    }

    private playerTurn(): void {
        console.log("Twoje zdrowie:", this.playerHealth);
        console.log("Zdrowie potwora:", this.monsterHealth);

        const actions: string[] = ["Zwykly atak", "Silny atak", "Leczenie"];
        const actionIndex = readlineSync.keyInSelect(actions, "Co chcesz zrobić?");

        switch (actionIndex) {
            case 0:
                this.normalAttack();
                break;
            case 1:
                this.strongAttack();
                break;
            case 2:
                this.heal();
                break;
        }
    }

    private normalAttack(): void {
        const damage = this.calculateDamage(3, 10);
        this.monsterHealth -= damage;
        console.log(`Zadałeś potworowi ${damage} obrażeń!`);
    }

    private strongAttack(): void {
        if (this.turnCount % 3 !== 0) {
            console.log("silny atak jest dostępny co trzecią turę. Użyj zwykłego ataku");
            return;
        }

        const damage = this.calculateDamage(10,20);
        this.monsterHealth -= damage;
        console.log(`Użyłeś silnego ataku i zadałeś potworowi ${damage} obrażeń!`);
    }

    private heal(): void {
        if (this.turnCount % 5 !== 0) {
            console.log("Leczenie jest dostępne co piątą turę. Użyj zwykłego ataku");
            return;
        }

        const healing = this.calculateDamage(5, 15);
        this.playerHealth += healing;
        console.log(`Uleczono się o ${healing} punktów życia.`);
    }

    private monsterTurn(): void {
        const damage = this.calculateDamage(5, 12);
        this.playerHealth -= damage;
        console.log(`Potwór zadał ci ${damage} obrażeń!`);
    }

    private calculateDamage(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    private checkGameOver(): boolean {
        if (this.playerHealth <= 0 || this.monsterHealth <= 0) {
            this.isGameOver = true;
            return true;
        }
        return false;
    }

    private displayWinner(): void {
        if (this.playerHealth <= 0) {
            console.log("Przegrałeś! Potwój cię zabił.");
        } else {
            console.log("Gratulacje. Wygrałeś grę!");
        }
    }

    private askForNewGame(): void {
        const playAgain = readlineSync.keyInYNStrict("Chcesz zagrać ponownie?");
        if (playAgain) {
            this.resetGame();
            this.start();
        } else {
            console.log("Dziękuję za grę! Do zobaczenia");
        }
    }

    private resetGame(): void {
        this.playerHealth = 100;
        this.monsterHealth = 100;
        this.isGameOver = false;
        this.turnCount = 1;
    }
}
const game: Game = new Game();
game.start();
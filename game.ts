import * as readlineSync from "readline-sync";

export enum Difficulty {
    EASY = "EASY",
    MEDIUM = "MEDIUM",
    HARD = "HARD"
}

class Game {
    private playerName: string;
    private playerHealth: number;
    private monsterHealth: number;
    private isGameOver: boolean;
    private turnCount: number;
    private difficulty: Difficulty;

    constructor() {
        this.playerName = "";
        this.playerHealth = 100;
        this.monsterHealth = 80;
        this.isGameOver = false;
        this.turnCount = 1;
        this.difficulty = Difficulty.MEDIUM;
    }

    public start(): void {
        this.setPlayerName();
        this.setDifficulty();

        console.log(`Witaj w grze Monster Slayer, ${this.playerName!}! (Poziom trudnosci: ${this.difficulty}`);
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

    private setPlayerName(): void {
        this.playerName = readlineSync.question("Podaj swoja nazwe uzytkownika: ");
    }

    private setDifficulty(): void {
        const difficultyOptions = Object.values(Difficulty);
        const difficultyIndex = readlineSync.keyInSelect(difficultyOptions, "Wybierz poziom trudnosci:");
        this.difficulty = difficultyOptions[difficultyIndex] as Difficulty;

        switch (this.difficulty) {
            case Difficulty.EASY:
                this.monsterHealth = 80;
                break;
            case Difficulty.MEDIUM:
                this.monsterHealth = 100;
                break;
            case Difficulty.HARD:
                this.monsterHealth = 120;
                break;
        }
    }

    private playerTurn(): void {
        console.log("Twoje zdrowie:", this.playerHealth);
        console.log("Zdrowie potwora:", this.monsterHealth);

        const actions: string[] = ["Zwykly atak", "Silny atak", "Leczenie"];
        const actionIndex = readlineSync.keyInSelect(actions, "Co chcesz zrobic?");

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
        const damage: number = this.calculateDamage(5, 12);
        this.monsterHealth -= damage;
        console.log(`Zadałeś potworowi ${damage} obrażeń!`);
    }

    private strongAttack(): void {
        if (this.turnCount % 3 !== 0) {
            console.log("Silny atak jest dostępny co trzecią turę. Użyj zwykłego ataku");
            return;
        }

        const damage: number = this.calculateDamage(10, 20);
        this.monsterHealth -= damage;
        console.log(`Użyłeś silnego ataku i zadałeś potworowi ${damage} obrażeń!`);
    }

    private heal(): void {
        if (this.turnCount % 5 !== 0) {
            console.log("Leczenie jest dostepne co piata ture. Uzyj zwyklego ataku");
            return;
        }

        const healing = this.calculateHealing(5, 12);
        this.playerHealth += healing;
        console.log(`Uleczono sie o ${healing} punktow zycia.`);
    }

    private monsterTurn(): void {
        const damage: number = this.calculateDamage(5, 14);
        this.playerHealth -= damage;
        console.log(`Potwor zadal ci ${damage} obrazen!`);
    }

    private calculateDamage(min: number, max: number): number {
        const damage = Math.floor(Math.random() * (max - min + 1) + min);
        switch (this.difficulty) {
            case Difficulty.EASY:
                return Math.floor(damage * 1.5);
            case Difficulty.MEDIUM:
                return Math.ceil(damage * 1.1);
            case Difficulty.HARD:
                return Math.ceil(damage * 0.6);
            default:
                return damage;
        }
    }

    private calculateHealing(min: number, max: number): number {
        const healing = Math.floor(Math.random() * (max - min + 1) + min);
        switch (this.difficulty) {
            case Difficulty.EASY:
                return Math.ceil(healing * 1.5);
            case Difficulty.MEDIUM:
                return healing;
            case Difficulty.HARD:
                return Math.floor(healing * 0.8);
            default:
                return healing;
        }
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
            console.log("Przegraleś! Potwor cie zabil.");
        } else {
            console.log("Gratulacje. Wygrałes gre!");
        }
    }

    private askForNewGame(): void {
        const playAgain = readlineSync.keyInYNStrict("Chcesz zagrac ponownie?");
        if (playAgain) {
            this.resetGame();
            this.start();
        } else {
            console.log("Dziekuje za grę! Do zobaczenia");
        }
    }

    private resetGame(): void {
        this.playerHealth = 100;
        this.monsterHealth = 80;
        this.isGameOver = false;
        this.turnCount = 1;
    }
}
const game: Game = new Game();
game.start();
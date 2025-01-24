// judgeService.ts

export interface Judge {
    name: string;
    email: string;
  }
  
  export class JudgeService {
    private judges: Judge[];
  
    constructor() {
      // Initializing a list of judges
      this.judges = [
        { name: "Admin", email: "admin@mail.com" },
        { name: "Judge 1", email: "judge1@knowcode.com" },
        { name: "Judge 2", email: "judge2@knowcode.com" },
        { name: "Judge 3", email: "judge3@knowcode.com" },
        { name: "Judge 4", email: "judge4@knowcode.com" },
        { name: "Judge 5", email: "judge5@knowcode.com" },
      ];
    }
  
    // Method to get the list of all judges
    getAllJudges(): Judge[] {
      return this.judges;
    }
  
    // Method to get a judge by name
    getJudgeByName(name: string): Judge | undefined {
      return this.judges.find(judge => judge.name === name);
    }
  }
  
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
        
        { name: "Het Vikram", email: "het@s4ds.com" },
        { name: "Lekhraj Varshney", email: "lekhraj@s4ds.com" },
        { name: "Rakesh Kumawat", email: "rakesh@s4ds.com" },
        { name: "Nitesh Mishra", email: "nitesh@s4ds.com" },
        { name: "Indranil", email: "indranil@s4ds.com" },
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
  

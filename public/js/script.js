class suitBatuGuntingKertas {
    constructor() {
      this.pilihanCom = document.getElementsByClassName("computerChoice")
      this.memperbarui = document.getElementById("refresh")
      this.memperbarui.addEventListener("click", this.refreshPage.bind(this));
    }
    
    computerChoice() {
      const comp = Math.random();
      if(comp < 0.34) {
          return "batu";
      }else if(comp >= 0.34 && comp < 0.67) {
          return "kertas";
      }else {
          return "gunting";
      }
    }
  
    winner(player,comp) {
       if(player === "batu" && comp === "gunting"){
         return "PLAYER 1 WIN";
        }else if(player === "batu" && comp === "kertas"){
          return "COM WIN";
        }else if(player === "kertas" && comp === "batu"){
          return "PLAYER 1 WIN";
        }else if(player === "kertas" && comp === "gunting"){
          return "COM WIN";
        }else if(player === "gunting" && comp === "kertas"){
          return "PLAYER 1 WIN";
        }else if(player === "gunting" && comp === "batu"){
          return "COM WIN";
        }else{
          return "DRAW";
        }
    }
  
    refreshPage() {
      location.reload(); 
    }
  
  }
  
  function pickOption(idImg) {
    const player = document.getElementById(idImg);
    console.log("player pilih", idImg);
    player.style.backgroundColor = "grey"
    const gameSuit = new suitBatuGuntingKertas()
    const choice = gameSuit.computerChoice()
    const computer = document.getElementById(choice + "-2")
    computer.style.backgroundColor = "grey"
    console.log("bot pilih", choice)
    const hasil = gameSuit.winner(idImg,choice)
    console.log("pemenang = ",hasil)
    const info = document.getElementById("result")
    info.innerHTML = hasil
  }
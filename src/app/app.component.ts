import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Chart from 'chart.js/auto';
import { getRelativePosition } from 'chart.js/helpers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  user: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    //this.getUser();
     // Hole das Canvas-Element
     console.log("test")
     var ctx = (document.getElementById('meineGrafik') as HTMLCanvasElement).getContext('2d');
     console.log(ctx)

     if(ctx !== null) {

    

 // Erstelle das Diagramm
 var meinDiagramm = new Chart(ctx, {
  type: 'bar',  // Typ des Diagramms (z.B. 'bar', 'line', 'pie')
  data: {
    labels: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni'],
    datasets: [{
      label: 'Monatliche Verkäufe',
      data: [12, 19, 3, 5, 2, 3],  // Daten für das Diagramm
      backgroundColor: 'rgba(54, 162, 235, 0.2)',  // Hintergrundfarbe der Balken
      borderColor: 'rgba(54, 162, 235, 1)',  // Randfarbe der Balken
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true  // Y-Achse beginnt bei 0
      }
    }
  
  }
});

console.log(meinDiagramm)
     }
    
  }

  login() {
    window.location.href = 'https://localhost:8443/oauth2/authorization/google';
  }

  logout() {
    this.http.post('https://localhost:8443/logout', {}, { withCredentials: true })
      .subscribe(() => {
        this.user = null;
      });
  }

  getUser() {
    this.http.get('https://localhost:8443/api/user/me', { withCredentials: true })
      .subscribe(user => {
        this.user = user;
      }, err => {
        this.user = null;
      });
  }
}

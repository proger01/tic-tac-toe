import {Component, ViewChild, ElementRef, OnInit, HostListener} from '@angular/core';

const CANVASSIZE = 600;

interface MouseCoordinates {
  x: number;
  y: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('canvas', {static: true})
  public canvas: ElementRef<HTMLCanvasElement>;
  public sectionSize: number;
  public player: number = 1;
  public title: string = 'Ходит игрок O';
  public playerOScores = [];
  public playerXScores = [];
  private ctx: CanvasRenderingContext2D;

  @HostListener('window:mouseup', ['$event'])
  public mouseUp(event): void {
    if (this.player === 1) {
      this.player = 2;
      this.title = 'Ходит игрок X';
    } else {
      this.player = 1;
      this.title = 'Ходит игрок O';
    }

    const canvasMousePosition = this.getCanvasMousePosition(event);
    this.addPlayingPiece(canvasMousePosition);
    this.drawCells();
  }


  public ngOnInit(): void {
    this.initCanvas();
  }

  private initCanvas(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.canvas.nativeElement.width = CANVASSIZE;
    this.canvas.nativeElement.height = CANVASSIZE;
    this.sectionSize = CANVASSIZE / 3;
    this.drawCells();
  }

  public drawCells(): void {
    this.drawHorizontalLine(50, 4);
    this.drawHorizontalLine(100, 4);

    this.drawVerticalLine(50, 4);
    this.drawVerticalLine(100, 4);
  }

  public drawHorizontalLine(y, z): void {
    const width = this.ctx.canvas.width / z;

    this.ctx.fillStyle = 'black';
    for (let x = 0; x < width; x++) {
      this.ctx.fillRect(z * x, z * y, z, z);
    }
  }

  public drawVerticalLine(x, z): void {
    const height = this.ctx.canvas.height / z;

    this.ctx.fillStyle = 'black';
    for (let y = 0; y < height; y++) {
      this.ctx.fillRect(z * x, z * y, z, z);
    }
  }

  public drawO(xCordinate, yCordinate): void {
    const halfSectionSize = (0.5 * this.sectionSize);
    const centerX = xCordinate + halfSectionSize;
    const centerY = yCordinate + halfSectionSize;
    const radius = (this.sectionSize - 100) / 2;
    const startAngle = 0 * Math.PI;
    const endAngle = 2 * Math.PI;

    this.ctx.lineWidth = 10;
    this.ctx.strokeStyle = '#01bBC2';
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    this.ctx.stroke();
  }

  public drawX(xCordinate, yCordinate): void {
    this.ctx.strokeStyle = '#f1be32';

    this.ctx.beginPath();

    const offset = 50;
    this.ctx.moveTo(xCordinate + offset, yCordinate + offset);
    this.ctx.lineTo(xCordinate + this.sectionSize - offset, yCordinate + this.sectionSize - offset);

    this.ctx.moveTo(xCordinate + offset, yCordinate + this.sectionSize - offset);
    this.ctx.lineTo(xCordinate + this.sectionSize - offset, yCordinate + offset);

    this.ctx.stroke();
  }

  public getCanvasMousePosition(event): MouseCoordinates {
    const rect = this.canvas.nativeElement.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  public addPlayingPiece(mouse): void {
    let xCordinate;
    let yCordinate;

    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        xCordinate = x * this.sectionSize;
        yCordinate = y * this.sectionSize;
        if (
          mouse.x >= xCordinate && mouse.x <= xCordinate + this.sectionSize &&
          mouse.y >= yCordinate && mouse.y <= yCordinate + this.sectionSize
        ) {
          this.getCell({x: xCordinate, y: yCordinate}, this.player);

          this.clearPlayingArea(xCordinate, yCordinate);

          if (this.player === 1) {
            this.drawX(xCordinate, yCordinate);
          } else {
            this.drawO(xCordinate, yCordinate);
          }
        }
      }
    }
  }

  public clearPlayingArea(xCordinate, yCordinate): void {
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(
      xCordinate,
      yCordinate,
      this.sectionSize,
      this.sectionSize
    );
  }

  public getCell(coordinates, player): void{
    const gamer = player === 1 ? this.playerOScores : this.playerXScores;
    switch (coordinates) {
      case {x: 0, y: 0}:
        gamer.push(1);
        break;
      case {x: 200, y: 0}:
        gamer.push(2);
        break;
      case {x: 400, y: 0}:
        gamer.push(3);
        break;
      case {x: 0, y: 200}:
        gamer.push(4);
        break;
      case {x: 200, y: 200}:
        gamer.push(5);
        break;
      case {x: 400, y: 200}:
        gamer.push(6);
        break;
      case {x: 0, y: 400}:
        gamer.push(7);
        break;
      case {x: 200, y: 400}:
        gamer.push(8);
        break;
      case {x: 400, y: 400}:
        gamer.push(9);
        break;
    }
  }
}

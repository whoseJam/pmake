import * as sd from "@/sd";

let svg = sd.svg();
let C = sd.color();
let R = sd.reader();
let n = 19, m = 48;
let mp = sd.Grid(svg).x(300).y(180).startM(1).startN(1).n(n).m(m).drag(true).resizeable(true);
mp.elementWidth(20).elementHeight(25).x(90).y(50);
let dx = [0, 1, 0, -1, 0, 2, 0, -2, 1, 1, -1, -1];
let dy = [1, 0, -1, 0, 2, 0, -2, 0, 1, -1, 1, -1];
sd.EnableFocusRect(mp);
let data = R.readCharMatrix(`
------------------------------------------------
---####-----#-----#----------------------####---
--######----#-----#---------------------######--
-########--#-#---#-#####--#-##-##---#--########-
-###--###--#-#---#-#----#-##-##--#--#--###--###-
-###--###--#--#-#--######-#--#---#-#---###--###-
-########--#--#-#--#------#--#----##---########-
--######---#---#---######-#--#-----#----######--
---####----------------------------#-----####---
----------------------------------#-------------
------------------------------------------------
---###--#--------#------#-----------------------
--#---#-#---------------#-----------------------
-#------#-##--#-##--##-###-#-##-###--###-#--##--
-#------##--#-##-#-#----#--##--#---##---##-#----
-#------#---#-#--#--#---#--#---#---##----#--#---
--#---#-#---#-#--#---#--#--#---#---##---##---#--
---###--#---#-#--#-##---#--#---#---#-###-#-##---
------------------------------------------------`, n, m);
let col;

for (let i = 1; i <= n; i++)
    for (let j = 1; j <= m; j++) {
        mp.value(i, j, sd.Text(mp, data[i][j]));
    }

async function dfs(x, y) {
    for (let i = 0; i < dx.length; i++) {
        let nx = x + dx[i];
        let ny = y + dy[i];
        if (1 > nx || nx > n || 1 > ny || ny > m) continue;
        if (mp.element(nx, ny).visited) continue;
        if (mp.value(nx, ny).text() === "-") continue;
        
        mp.element(nx, ny).visited = true;
        mp.startAnimate(30).color(nx, ny, col).endAnimate();

        await dfs(nx, ny);
    }
}

async function main() {
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m ; j++) {
            if (mp.element(i, j).visited) continue;
            if (mp.value(i, j).text() === "-") continue;
            col = C.rand();

            await sd.pause();
            mp.startAnimate();
            mp.focus(i, j);
            mp.endAnimate();
            await sd.pause();
            mp.startAnimate();
            mp.color(i, j, col);
            mp.endAnimate();

            await dfs(i, j);
        }
    }
}

main();
#include<bits/stdc++.h>
using namespace std;
typedef long long ll;

int read(){
	int s=0,f=1;char t=getchar();
	while('0'>t||t>'9'){
		if(t=='-')f=-1;
		t=getchar();
	}
	while('0'<=t&&t<='9'){
		s=(s<<1)+(s<<3)+t-'0';
		t=getchar();
	}
	return s*f;
}

const int N=35;
const int MXK=65;
const int Mod=998244353;
int n,m,K,a[N][N],b[N][N];
int dp[N][N][MXK][N][N][3];

int Inc(int x,int y){return x+y>=Mod?x+y-Mod:x+y;}
int Dec(int x,int y){return x-y<0?x-y+Mod:x-y;}
int Mul(int x,int y){return (ll)x*y%Mod;}

int main(){
	n=read();m=read();K=read();
	for(int i=1;i<=n;i++)
		for(int j=1;j<=m;j++)
			a[i][j]=read();
	for(int i=1;i<=n;i++)
		for(int j=1;j<=m;j++)
			b[i][j]=read();
	dp[1][1][K][0][0][0]=1;
	for(int i=1;i<=n;i++)
		for(int j=1;j<=m;j++)
			for(int k=K;k>=0;k--)
				for(int x=0;x<=n;x++)
					for(int y=0;y<=m;y++){
						int& cur0=dp[i][j][k][x][y][0];
						int& cur1=dp[i][j][k][x][y][1];
						int& cur2=dp[i][j][k][x][y][2];
						
						// (i,j,k,x,y,0) -> (i,j,k,x,y,1)
						cur1=Inc(cur1,cur0);
						
						// (i,j,k,x,y,1) -> (i,j,k-a[i][j],x+1,y,1)
						if(k-a[i][j]>=0){
							int& nxt=dp[i][j][k-a[i][j]][x+1][y][1];
							nxt=Inc(nxt,cur1);
						}
						
						// (i,j,k,x,y,1) -> (i,j,k,x,y,2)
						cur2=Inc(cur2,cur1);
						
						// (i,j,k,x,y,2) -> (i,j,k-b[i][j],x,y+1,2)
						if(k-b[i][j]>=0){
							int& nxt=dp[i][j][k-b[i][j]][x][y+1][2];
							nxt=Inc(nxt,cur2);
						}
						
						// (i,j,k,x,y,2) -> (i+1,j,k,x,y,0)
						if(i<=x){
							int& nxt=dp[i+1][j][k][x][y][0]; 
							nxt=Inc(nxt,cur2);
						}
						
						// (i,j,k,x,y,2) -> (i,j+1,k,x,y,0)
						if(j<=y){
							int& nxt=dp[i][j+1][k][x][y][0];
							nxt=Inc(nxt,cur2);
						}
					}
	for(int i=1;i<=n;i++){
		for(int j=1;j<=m;j++){
			cout<<dp[i][j][0][i-1][j-1][2]<<" ";
		}cout<<endl;
	}
	return 0;
}


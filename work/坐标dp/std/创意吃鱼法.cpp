#include<iostream>
#include<cstdio>
using namespace std;

const int N=2505;
int L[N][N],R[N][N],U[N][N];
int G[N][N],fL[N][N],fR[N][N];
int n,m,ans;

int main(){
	scanf("%d%d",&n,&m);
	for(int i=1;i<=n;i++)
		for(int j=1;j<=m;j++)
			scanf("%d",&G[i][j]);
	for(int i=1;i<=n;i++){
		for(int j=1;j<=m;j++){
			if(!G[i][j])L[i][j]=L[i][j-1]+1,U[i][j]=U[i-1][j]+1;
			else L[i][j]=0,U[i][j]=0;
		}
		for(int j=m;j>=1;j--)
			if(!G[i][j])R[i][j]=R[i][j+1]+1;
			else R[i][j]=0;
	}
	for(int i=1;i<=n;i++)
		for(int j=1;j<=m;j++)
			if(G[i][j]){
				fL[i][j]=min(min(L[i][j-1],U[i-1][j]),fL[i-1][j-1])+1;
				fR[i][j]=min(min(R[i][j+1],U[i-1][j]),fR[i-1][j+1])+1;
				ans=max(max(fL[i][j],fR[i][j]),ans);
			}
	cout<<ans;
	return 0;
}

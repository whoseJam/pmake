#include<iostream>
#include<cstdio>
#include<cstring>
#include<algorithm>
using namespace std;

const int MAXN=305;
int Lf[MAXN][MAXN],Rf[MAXN][MAXN],pos[MAXN],N,M,ans=0;

bool cmp(int t1,int t2){
	return t1<t2;
}

int getNum(int tmp){
	if(tmp<0)return -tmp;
	return tmp;
}

int main(){
	scanf("%d%d",&N,&M);
	for(int i=1;i<=N;i++)scanf("%d",&pos[i]);
	sort(pos+1,pos+1+N,cmp);
	
	for(int k=1;k<=N;k++){
		memset(Lf,0,sizeof(Lf));
		memset(Rf,0,sizeof(Rf));
		for(int i=1;i<=N;i++){
			Lf[i][i]=Rf[i][i]=M-getNum(pos[i])*k;
			ans=max(ans,Lf[i][i]);
		}
		for(int len=2;len<=k;len++)
			for(int l=1;l<=N-len+1;l++){
				int r=l+len-1;
				Lf[l][r]=max(Lf[l+1][r]+M-(k-(r-l))*(pos[l+1]-pos[l]),Rf[l+1][r]+M-(k-(r-l))*(pos[r]-pos[l]));
				Rf[l][r]=max(Rf[l][r-1]+M-(k-(r-l))*(pos[r]-pos[r-1]),Lf[l][r-1]+M-(k-(r-l))*(pos[r]-pos[l]));
			}
		for(int i=1;i+k-1<=N;i++)
			ans=max(ans,max(Lf[i][i+k-1],Rf[i][i+k-1]));
	}
	printf("%d",ans);
	return 0;
}

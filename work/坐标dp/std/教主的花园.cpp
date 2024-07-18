#include<algorithm>
#include<iostream>
#include<cstring>
#include<iomanip>
#include<cstdio>
#include<vector>
#include<queue>
#include<cmath>
#define GET getchar()
#define LL long long
using namespace std;

namespace FastIO{
	const int L=(1<<20);
	char buf[L],*S,*T;
	#ifdef ONLINE_JUDGE
	inline char getchar(){
		if(S==T){T=(S=buf)+fread(buf,1,L,stdin);if(S==T)return EOF;}
		return *S++;
	}
	#endif
	inline int read(){
		int s=0,f=1;char t=GET;
		while('0'>t||t>'9'){if(t=='-')f=-1;t=GET;}
		while('0'<=t&&t<='9'){s=(s<<1)+(s<<3)+t-'0';t=GET;}
		return s*f;
	}
}
using FastIO::read;

const int N=100005;
const int inf=2e9;
int n,val[N][3];
int dp[N][4];

int Solve(int fla){
	for(int i=0;i<=3;i++)dp[1][i]=-inf;
	if(fla==0)dp[1][fla]=val[1][0];
	if(fla==1||fla==2)dp[1][fla]=val[1][1];
	if(fla==3)dp[1][fla]=val[1][2];
	for(int i=2;i<=n;i++){
		dp[i][0]=max(dp[i-1][2],dp[i-1][3])+val[i][0];
		dp[i][1]=dp[i-1][3]+val[i][1];
		dp[i][2]=dp[i-1][0]+val[i][1];
		dp[i][3]=max(dp[i-1][0],dp[i-1][1])+val[i][2];
	}
	if(fla==0)return max(dp[n][2],dp[n][3]);
	if(fla==1)return dp[n][3];
	if(fla==2)return dp[n][0];
	if(fla==3)return max(dp[n][0],dp[n][1]);
}

int main(){
	n=read();
	for(int i=1;i<=n;i++){
		val[i][0]=read();
		val[i][1]=read();
		val[i][2]=read();
	}
	int Ans=0;
	for(int i=0;i<=3;i++)
		Ans=max(Ans,Solve(i));
	cout<<Ans<<'\n';
	return 0;
}

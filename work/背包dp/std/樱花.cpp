#include<bits/stdc++.h>
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
		int s=0,f=1;char t=getchar();
		while('0'>t||t>'9'){if(t=='-')f=-1;t=getchar();}
		while('0'<=t&&t<='9'){s=(s<<1)+(s<<3)+t-'0';t=getchar();}
		return s*f;
	}
}
using FastIO::read;

const int N=10005;
const int M=1005;
int T[N],P[N],C[N];
int f[N][M],n;

int readTime(){
	int h=read(),m=read();
	return h*60+m;
}

int main(){
	int Ts=readTime();
	int Te=readTime();
	int t=Te-Ts;
	n=read();
	for(int i=1;i<=n;i++){
		T[i]=read();
		C[i]=read();
		P[i]=read();
		if(P[i]==0)P[i]=1000000;
	}
	for(int i=1;i<=n;i++){
		for(int j=1;j<=t;j++){
			for(int k=0;k<=P[i]&&T[i]*k<=j;k++){
				f[i][j]=max(f[i][j],f[i-1][j-T[i]*k]+C[i]*k);
			}
		}
	}
	cout<<f[n][t]<<'\n';
	return 0;
}


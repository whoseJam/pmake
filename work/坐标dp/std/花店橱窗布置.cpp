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

const int N=105;
const int inf=0x3f3f3f3f;
int f[N][N],a[N][N],F,V;
int lst[N][N];

void output(int i,int j){
	if(i==0)return;
	output(i-1,lst[i][j]);
	cout<<j<<' ';
}

int main(){
	F=read();V=read();
	for(int i=1;i<=F;i++)
		for(int j=1;j<=V;j++)
			a[i][j]=read();
	
	for(int j=1;j<=V;j++)f[1][j]=a[1][j];
	for(int i=2;i<=F;i++){
		for(int j=1;j<=V;j++){
			f[i][j]=-inf;
			for(int k=1;k<j;k++){
				if(f[i][j]<f[i-1][k]+a[i][j]){
					f[i][j]=f[i-1][k]+a[i][j];
					lst[i][j]=k;
				}
			}
		}
	}

	int ans=-inf,pos=0;
	for(int j=1;j<=V;j++){
		if(ans<f[F][j]){
			ans=f[F][j];
			pos=j;
		}
	}
	cout<<ans<<'\n';
	output(F,pos);
	return 0;
}


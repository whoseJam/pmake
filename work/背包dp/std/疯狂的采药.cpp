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

typedef long long ll;

const int M=10005;
const int T=1e7+5;
int m,t,a[M],b[M];
ll f[T];

int main(){
	t=read();m=read();
	for(int i=1;i<=m;i++){
		a[i]=read();
		b[i]=read();
	}
	for(int i=1;i<=m;i++){
		for(int j=a[i];j<=t;j++){
			f[j]=max(f[j],f[j-a[i]]+b[i]);
		}
	}
	cout<<f[t]<<'\n';
	return 0;
}


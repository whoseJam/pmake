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
int n,m,p[N],t[N],f[N];

int main(){
	m=read();n=read();
	for(int i=1;i<=n;i++){
		p[i]=read();
		t[i]=read();
	}
	for(int i=1;i<=n;i++){
		for(int j=t[i];j<=m;j++){
			f[j]=max(f[j],f[j-t[i]]+p[i]);
		}
	}
	cout<<f[m]<<'\n';
	return 0;
}


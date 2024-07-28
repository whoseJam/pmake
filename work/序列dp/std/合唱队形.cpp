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
int f[N],g[N],h[N],n;

int main(){
	n=read();
	for(int i=1;i<=n;i++)h[i]=read();
	for(int i=1;i<=n;i++){
		f[i]=1;
		for(int j=1;j<i;j++)
			if(h[j]<h[i])f[i]=max(f[i],f[j]+1);
	}
	for(int i=n;i>=1;i--){
		g[i]=1;
		for(int j=n;j>i;j--)
			if(h[j]<h[i])g[i]=max(g[i],g[j]+1);
	}
	int ans=0;
	for(int i=1;i<=n;i++)
		ans=max(ans,f[i]+g[i]-1);
	cout<<n-ans;
	return 0;
}


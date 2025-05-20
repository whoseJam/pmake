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

const int inf=0x3f3f3f3f;
const int H=60005;
const int N=105;
int p[N],c[N],n,h,f[H];
int maxh;

int main(){
	n=read();h=read();
	for(int i=1;i<=n;i++){
		p[i]=read();
		c[i]=read();
		maxh=max(maxh,h+p[i]);
	}
	
	f[0]=0;
	for(int i=1;i<=maxh;i++)f[i]=inf;
	for(int i=1;i<=n;i++){
		for(int j=p[i];j<=maxh;j++){
			f[j]=min(f[j],f[j-p[i]]+c[i]);
		}
	}
	
	int ans=inf;
	for(int i=h;i<=maxh;i++)ans=min(ans,f[i]);
	cout<<ans<<'\n';
	return 0;
}


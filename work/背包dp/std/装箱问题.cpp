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

const int V=20005;
const int N=35;
int v,n,f[V],a[N];

int main(){
	v=read();
	n=read();
	for(int i=1;i<=n;i++)
		a[i]=read();
	f[0]=1;
	for(int i=1;i<=n;i++){
		for(int j=v;j>=a[i];j--){
			f[j]=f[j]|f[j-a[i]];
		}
	}
	for(int i=v;i>=0;i--)
		if(f[i]){
			cout<<v-i<<'\n';
			break;
		}
	return 0;
}


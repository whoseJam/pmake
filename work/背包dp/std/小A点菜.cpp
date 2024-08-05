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

const int M=10005;
const int N=105;
int a[N],f[M],n,m;

int main(){
	n=read();m=read();
	for(int i=1;i<=n;i++)
		a[i]=read();
	
	f[0]=1;
	for(int i=1;i<=n;i++){
		for(int j=m;j>=a[i];j--){
			f[j]+=f[j-a[i]];
			// f(i,j)=f(i-1,j)+f(i-1,j-a[i]);
			// f(j)=f(j)+f(j-a[i]); 
		}
	}
	cout<<f[m]<<'\n';
	return 0;
}


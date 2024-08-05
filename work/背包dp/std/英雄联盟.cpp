#include<bits/stdc++.h>
using namespace std;

typedef long long ll;

namespace FastIO{
	const ll L=(1<<20);
	char buf[L],*S,*T;
	#ifdef ONLINE_JUDGE
	inline char getchar(){
		if(S==T){T=(S=buf)+fread(buf,1,L,stdin);if(S==T)return EOF;}
		return *S++;
	}
	#endif
	inline ll read(){
		ll s=0,f=1;char t=getchar();
		while('0'>t||t>'9'){if(t=='-')f=-1;t=getchar();}
		while('0'<=t&&t<='9'){s=(s<<1)+(s<<3)+t-'0';t=getchar();}
		return s*f;
	}
}
using FastIO::read;

const ll N=200;
const ll C=1000005;
ll n,m,K[N],c[N],f[C],maxc;

int main(){
	n=read();m=read();
	for(ll i=1;i<=n;i++)K[i]=read();
	for(ll i=1;i<=n;i++)c[i]=read();
	for(ll i=1;i<=n;i++)maxc+=K[i]*c[i];
	
	f[0]=1;
	for(ll i=1;i<=n;i++){
		for(ll j=maxc;j>=0;j--){
			for(ll k=1;k<=K[i]&&j-k*c[i]>=0;k++){
				f[j]=max(f[j],f[j-k*c[i]]*k);
			}
		}
	}
	for(ll j=0;j<=maxc;j++){
		if(f[j]>=m){
			cout<<j<<'\n';
			break; 
		}
	}
	return 0;
}


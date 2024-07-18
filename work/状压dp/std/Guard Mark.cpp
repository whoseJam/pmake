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

const ll N=21;
const ll U=1<<20;
ll height[N],weight[N],strength[N];
ll n,h,f[U],W[U],H[U],ans=-1;

bool contain(ll S,ll i){
	return (S>>i-1)&1;
}

int main(){
	n=read();h=read();
	for(ll i=1;i<=n;i++){
		height[i]=read();
		weight[i]=read();
		strength[i]=read();
	}
	ll All=(1<<n)-1;
	for(ll S=0;S<=All;S++){
		f[S]=-1;
		for(ll i=1;i<=n;i++){
			if(!contain(S,i))continue;
			W[S]+=weight[i];
			H[S]+=height[i];
		}
	}
	for(ll i=1;i<=n;i++)
		f[1<<i-1]=strength[i];
	for(ll S=1;S<=All;S++){
		for(ll i=1;i<=n;i++){
			if(contain(S,i))continue;
			if(strength[i]>=W[S]){
				ll cost=min(f[S],strength[i]-W[S]);
				f[S|1<<i-1]=max(f[S|1<<i-1],cost);
			}
		}
		if(H[S]>=h)ans=max(ans,f[S]);
	}
	if(ans==-1)cout<<"Mark is too tall";
	else cout<<ans<<'\n';
	return 0;
}


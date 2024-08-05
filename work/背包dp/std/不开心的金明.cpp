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

const ll inf=0x3f3f3f3f;
const ll N=105;
ll n,w,v[N],p[N],B=inf,dp[5][N][N*3];
vector<ll> item[5];

bool cmp(ll a,ll b){
	return p[a]>p[b];
}

int main(){
	n=read();w=read();
	for(ll i=1;i<=n;i++){
		v[i]=read();
		p[i]=read();
		B=min(B,v[i]);
	}
	for(ll i=1;i<=n;i++){
		v[i]-=B;
		item[v[i]].push_back(i);
	}
	for(ll i=0;i<=3;i++){
		sort(item[i].begin(),item[i].end(),cmp);
		for(ll j=1;j<=n;j++){
			for(ll k=0;k<=300;k++){
				ll lim=min(n,(ll)item[i].size());
				ll sump=0;
				for(ll f=0;f<=lim&&k>=f*i&&j>=f;f++){
					ll tmp=i?dp[i-1][j-f][k-f*i]:0;
					dp[i][j][k]=max(dp[i][j][k],tmp+sump);
					if(f<item[i].size())sump+=p[item[i][f]];
				}
			}
		}
	}
	ll ans=0;
	for(ll i=1;i<=n;i++){
		for(ll res=0;res<=300;res++){
			if(i*B+res<=w){
				ans=max(ans,dp[3][i][res]);
			}
		}
	}
	cout<<ans<<'\n';
	return 0;
}


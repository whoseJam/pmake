#include<bits/stdc++.h>
using namespace std;
typedef long long ll;
const int N=100005;
int n,x;
ll f[N];

struct BIT{
	ll c[N];
	int lowbit(int x){
		return x&(-x);
	}
	void upd(int x,ll v){
		for(int i=x;i<=n;i+=lowbit(i))
			c[i]=max(c[i],v);
	}
	ll ask(int x){
		ll ans=0;
		for(int i=x;i>0;i-=lowbit(i))
			ans=max(ans,c[i]);
		return ans;
	}
}T;

int main(){
	scanf("%d",&n);
	ll ans=0;
	for(int i=1;i<=n;i++){
		scanf("%d",&x);
		f[i]=T.ask(x-1)+1;
		T.upd(x,f[i]);
	}
	for(int i=1;i<=n;i++)
		ans=max(ans,f[i]);
	printf("%lld",ans);
	return 0;
}

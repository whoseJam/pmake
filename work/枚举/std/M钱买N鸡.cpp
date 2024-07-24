#include<bits/stdc++.h>
using namespace std;

typedef long long ll;
ll n,m,a,b,c,ans;

int main(){
	cin>>m>>n>>a>>b>>c;
	for(ll x=0;x<=n;x++){
		ll tmp0=m-c*n-(a-c)*x;
		ll tmp1=b-c;
		if(tmp0%tmp1!=0)continue;
		ll y=tmp0/tmp1;
		if(y<0)continue;
		ll z=n-x-y;
		if(z<0)continue;
		ans++;
	}
	cout<<ans;
	return 0;
}

#include<bits/stdc++.h>
using namespace std;
typedef long long ll;

int read(){
	int s=0,f=1;char t=getchar();
	while('0'>t||t>'9'){
		if(t=='-')f=-1;
		t=getchar();
	}
	while('0'<=t&&t<='9'){
		s=(s<<1)+(s<<3)+t-'0';
		t=getchar();
	}
	return s*f;
}

const int Mod=1000000007;
const int N=705;
int dp[N][N][3][3];
bool vis[N][N][3][3];
char s[N];
int n,match[N];
int sta[N],top;

bool colorIsSame(int c1,int c2){
	if(c1==0||c2==0)return false;
	return c1==c2;
}

bool colorPairIsValid(int c1,int c2){
	if(c1==0&&c2!=0)return true;
	if(c2==0&&c1!=0)return true;
	return false;
}

int Dfs(int l,int r,int cl,int cr){
	if(l+1==r)return colorPairIsValid(cl,cr);
	if(vis[l][r][cl][cr])return dp[l][r][cl][cr];
	
	if(match[l]==r){ // (...)  cl ncl ... ncr cr
		int ans=0;
		for(int ncl=0;ncl<=2;ncl++)
			for(int ncr=0;ncr<=2;ncr++){
				if(colorIsSame(cl,ncl))continue;
				if(colorIsSame(cr,ncr))continue;
				if(!colorPairIsValid(cl,cr))continue;
				ans+=Dfs(l+1,r-1,ncl,ncr);
				ans%=Mod;
			}
		dp[l][r][cl][cr]=ans;
		vis[l][r][cl][cr]=true;
	}else{	// (...)(...)(...)(...)  Lcl ... Lcr Rcl ... ? ? ... Rcr
		int Lcl=cl;
		int Rcr=cr;
		int ans=0;
		for(int Lcr=0;Lcr<=2;Lcr++)
			for(int Rcl=0;Rcl<=2;Rcl++){
				if(colorIsSame(Rcl,Lcr))continue;
				if(!colorPairIsValid(Lcl,Lcr))continue;
				ans+=(ll)Dfs(l,match[l],Lcl,Lcr)*Dfs(match[l]+1,r,Rcl,Rcr)%Mod;
				ans%=Mod;
			}
		dp[l][r][cl][cr]=ans;
		vis[l][r][cl][cr]=true;
	}
	return dp[l][r][cl][cr];
}

int main(){
	scanf("%s",s+1);n=strlen(s+1);
	for(int i=1;i<=n;i++){
		if(s[i]=='(')sta[++top]=i;
		if(s[i]==')'){
			match[sta[top]]=i;
			match[i]=sta[top];
			top--;
		}
	}
	int ans=0;
	for(int cl=0;cl<=2;cl++)
		for(int cr=0;cr<=2;cr++){
			ans+=Dfs(1,n,cl,cr);
			ans%=Mod;
		}
	cout<<ans<<endl;
	return 0;
}


#include<bits/stdc++.h>
using namespace std;

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

const int inf=0x3f3f3f3f;
const int N=1005;
int dp[N][N];
char s[N];
int n;

int main(){
	scanf("%s",s+1);n=strlen(s+1);
	for(int len=2;len<=n;len++){
		for(int i=1;i+len-1<=n;i++){
			int j=i+len-1;
			dp[i][j]=inf;
			if(s[i]==s[j])dp[i][j]=min(dp[i][j],dp[i+1][j-1]);
			dp[i][j]=min(dp[i+1][j]+1,dp[i][j]);
			dp[i][j]=min(dp[i][j-1]+1,dp[i][j]);
		}
	}
	cout<<dp[1][n];
	return 0;
}


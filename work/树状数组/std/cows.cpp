#include<algorithm>
#include<iostream>
#include<cstring>
#include<cstdio>
#include<cmath>
using namespace std;

const int N=100005;
int n,ans[N],C[N];

struct cows{
	int S,E,id;
}c[100005];

bool cmp(cows a,cows b){
	if(a.E!=b.E)return a.E>b.E;
	return a.S<b.S;
}

int lowbit(int x){
	return x&(-x);
}

void add(int x,int d){
	for(int i=x;i<=100000;i=i+lowbit(i))
		C[i]+=d;
}

int sum(int x){
	int ans=0;
	for(int i=x;i>0;i=i-lowbit(i))
		ans+=C[i];
	return ans;
}

void clear(){
	memset(C,0,sizeof(C));
	memset(c,0,sizeof(c));
	memset(ans,0,sizeof(ans));
}

int main(){
	while(scanf("%d",&n)!=EOF){
		if(n==0)break;
		clear();
		
		for(int i=1;i<=n;i++){
			scanf("%d%d",&c[i].S,&c[i].E);
			c[i].S++;
			c[i].id=i;
		}
		sort(c+1,c+1+n,cmp);
		
		for(int i=1;i<=n;i++){
			if(i>1&&c[i].S==c[i-1].S&&c[i].E==c[i-1].E)
				ans[c[i].id]=ans[c[i-1].id];
			else ans[c[i].id]=sum(c[i].S);
			add(c[i].S,1);
		}
		for(int i=1;i<=n;i++)
			printf("%d ",ans[i]);
		printf("\n");
	}
	return 0;
}

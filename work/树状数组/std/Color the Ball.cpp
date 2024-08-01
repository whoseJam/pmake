#include<algorithm>
#include<iostream>
#include<cstring>
using namespace std;

const int N=100005;
int n,c[N];

int lowbit(int x){
	return x&(-x);
}

void add(int x,int d){
	for(int i=x;i<=n;i+=lowbit(i))
		c[i]+=d;
}

int sum(int x){
	int ans=0;
	for(int i=x;i>0;i-=lowbit(i))
		ans+=c[i];
	return ans;
}

int main(){
	int a,b;
	while(true){
		memset(c,0,sizeof(c));
		
		cin>>n;
		if(n==0)break;
		
		for(int i=1;i<=n;i++){
			cin>>a>>b;
			add(a,1);
			add(b+1,-1);
		}
		for(int i=1;i<=N;i++){
			cout<<sum(i)<<" ";
		}
		cout<<endl;
	}
	return 0;
}

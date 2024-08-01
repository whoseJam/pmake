#include<algorithm>
#include<iostream>
#include<cmath>
using namespace std;

const int N=20005; 
int c[N];

int lowbit(int x){
	return x&(-x);
}

void add(int x,int d){
	for(int i=x;i<N;i+=lowbit(i))
		c[i]=c[i]^d; 
}

int sum(int x){
	int ans=0;
	for(int i=x;i>0;i-=lowbit(i))
		ans=ans^c[i];
	return ans;
}

int main(){
	string c1,c2,c3;
	int x,y,len=0;
	while(cin>>c1){
		if(c1=="ADD"||c1=="REMOVE"){
			cin>>x;
			add(x,x);
		}
		if(c1=="XOR"){
			cin>>c2>>x>>c3>>y;
			if(y<x)cout<<"0"<<endl;
			else cout<<(sum(y)^sum(x-1))<<endl;
		}
	}
	return 0;
}

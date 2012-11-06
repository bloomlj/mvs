#coding=gbk
#!/bin/env python
import os
import subprocess
import wx
import socket
class MyFrame(wx.Frame):
    def __init__(self):
        wx.Frame.__init__(self, None, -1,"���Ͻ�ͨ��ѧ���´��ƶ�ͶƱϵͳ������� by lijun", size=(600, 600))
        panel = wx.Panel(self, -1)
        panel.Bind(wx.EVT_MOTION,  self.OnMove)
        panel.Bind(wx.EVT_CLOSE,  self.OnClose)

        #get current path
##        pwd = os.getcwd()
##        
##        wx.StaticText(panel, -1, "mongodb·��:", pos=(10, 40))
##        self.dbserver = wx.TextCtrl(panel, -1, pwd+"\\mongodb\bin\mongod.exe\\", pos=(100, 40))
##        
##        wx.StaticText(panel, -1, "dbpath:", pos=(10, 80))
##        self.dbpath = wx.TextCtrl(panel, -1, pwd+"\\mongodb\data\\", pos=(100, 80))
##        
##        wx.StaticText(panel, -1, "server path:", pos=(10, 120))
##        self.password = wx.TextCtrl(panel, -1,  pwd+"\\mongodb\bin\mongod.exe\\", pos=(100, 120))
        
       # wx.StaticText(panel, -1, "���ݿ�:", pos=(10, 160))
        #self.database = wx.TextCtrl(panel, -1, "test", pos=(100, 160))
        #wx.StaticText(panel, -1, "ͼƬĿ¼:", pos=(10, 200))
        
        #pwd = os.getcwd()
        #self.folder = wx.TextCtrl(panel, -1, pwd+"\\images\\", pos=(100, 200),size=(200,-1))
        #wx.StaticText(panel, -1, "�м���\��β������c:\images\\", pos=(300, 200))
                
        self.startbutton = wx.Button(panel, -1, "����ͶƱ������",pos=(20, 20))
        self.Bind(wx.EVT_BUTTON, self.startServer, self.startbutton)
        self.startbutton.SetDefault()

        self.shutbutton = wx.Button(panel, -1, "û���� �ر�ͶƱ������",pos=(20, 60))
        self.Bind(wx.EVT_BUTTON, self.shutServer, self.shutbutton)
        
        self.msgshow = wx.StaticText(panel, -1, "!!!", pos=(20, 100))

        localIP = socket.gethostbyname(socket.gethostname())#�õ�����ip
        #print "local ip:%s "%localIP
        self.msgshow.SetLabel("����IP��"+localIP)
        
    def startServer(self, event):
        self.startbutton.SetLabel("starting!")
        #
##        dbserver = self.dbserver.GetValue()
##        dbpath = self.dbpath.GetValue()
##        password = self.password.GetValue()
##        database = self.database.GetValue()
##        folder = self.folder.GetValue()
        
        mongodb_start_cmd = "..\\..\\mongodb\\bin\\mongod.exe --dbpath ..\\..\\mongodb\\data"
        node_start_cmd = "node ..\\server\\app.js"
        
        #self.msgshow.SetLabel(mongodb_cmdstr + "\n->>>")
        self.msgshow.SetForegroundColour('blue')
        
        #re = os.popen(cmdstr).read()
        #mongodb_re = os.popen(mongodb_cmdstr).read()
        #server_re = os.system(server_cmdstr)
        
        m_process = subprocess.Popen(mongodb_start_cmd)
        n_process = subprocess.Popen(node_start_cmd)
        
        #m_process = subprocess.Popen(mongodb_start_cmd, stdin = subprocess.PIPE, stdout = subprocess.PIPE, stderr = subprocess.PIPE, shell = False)
        #p.stdin.write('3/n')  
        #p.stdin.write('4/n')  
        #re = m_process.stdout.read()  
        #re = unicode(re, "cp936")
        #re = os.popen("ls -l").read()
        #self.msgshow.SetLabel("\n->>>\n" + str(re))
        #self.msgshow.SetLabel(str(m_process.stdout.read()))
        self.startbutton.SetLabel("ͶƱ�������Ѿ�����!")

        
        localIP = socket.gethostbyname(socket.gethostname())#�õ�����ip
        #print "local ip:%s "%localIP
        self.msgshow.SetLabel("����������������http://localhost:3000�����ʺ�̨��������IP��"+localIP + "��Ϊ��������ַ��")

    def shutServer(self, event):
        self.shutbutton.SetLabel("shutting!")

        #mongodb_end_cmd = "..\\..\\mongodb\\bin\\mongod.exe --dbpath ..\\..\\mongodb\\data"
        #node_end_cmd = "node ..\\server\\app.js"
        
        #self.msgshow.SetForegroundColour('blue')
        
        #m_process = subprocess.Popen(mongodb_end_cmd)
        #n_process = subprocess.Popen(node_end_cmd)

        m_process.terminate()
        n_process.terminate()
        self.shutbutton.SetLabel("ͶƱ�������Ѿ��ر�!")
    
    def OnMove(self, event):
        pos = event.GetPosition()	
        #self.posCtrl.SetValue("%s, %s" % (pos.x, pos.y))

    def OnClose(self,event):
	wx.MessageBox("Hello wxPython", "wxApp")
if __name__ == '__main__':
    app = wx.PySimpleApp()
    frame = MyFrame()
    frame.Show(True)
    app.MainLoop()

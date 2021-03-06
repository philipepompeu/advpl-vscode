'use strict';
import * as vscode from 'vscode';
import {advplCompile} from './advplCompile';
import {smartClientLaunch} from './smartClientLaunch';
import {advplConsole} from './advplConsole';
import {advplPatch} from './advplPatch';
import {advplMonitor} from './advplMonitor';
import * as fs from 'fs';
let advplDiagnosticCollection = vscode.languages.createDiagnosticCollection();
let OutPutChannel = new advplConsole() ; 
let fileToBuildPath;
export function activate(context: vscode.ExtensionContext) {

    

    context.subscriptions.push(getProgramName());
    context.subscriptions.push(startSmartClient());    
    context.subscriptions.push(addGetDebugInfosCommand());
    context.subscriptions.push(compile());
    context.subscriptions.push(menucompile());
    context.subscriptions.push(menucompilemulti());
    context.subscriptions.push(getAuthorizationId()); 
    context.subscriptions.push(CipherPassword());

    //Binds dos comandos de patch
    context.subscriptions.push(PathSelectSource());
    context.subscriptions.push(PathApply());
    context.subscriptions.push(PathBuild());
    context.subscriptions.push(PathSelectFolder());
    context.subscriptions.push(PathFileToBuild());
    //Binds do monitor
    context.subscriptions.push(GetThreads());

}


export function deactivate() {
}
function getProgramName()
{
   let disposable = vscode.commands.registerCommand('advpl.getProgramName', () => {
        var startProgram = vscode.workspace.getConfiguration("advpl").get<string>("startProgram");
		//value: startProgram/
        const p = vscode.window.showInputBox({placeHolder: "Informe o program"});
        
        return p;
	});
    return disposable;
}
/**
 * Inicia o smartClient
 */
function startSmartClient()
{
let disposable = vscode.commands.registerCommand('advpl.startSmartClient', () => {
        
        var scPath :string; 
        scPath = vscode.workspace.getConfiguration("advpl").get<string>("smartClientPath");
       // scPath += "smartclient.exe";
        var obj2  = new smartClientLaunch(scPath);
        obj2.start();
    });
    return disposable;
}
function menucompile()
{
   
let disposable = vscode.commands.registerCommand('advpl.menucompile', function (context)  {
        
        //var editor = vscode.window.activeTextEditor;
        var cSource = context._fsPath;
        vscode.window.setStatusBarMessage('Starting advpl compile...' + cSource,3000);
        var compile = new advplCompile(JSON.stringify(vscode.workspace.getConfiguration("advpl")),advplDiagnosticCollection, OutPutChannel);
                compile.setAfterCompileOK(function (){
                   // vscode.window.showInformationMessage('Source ' + editor.document.fileName + ' Compiled!!! :D') ;
                    vscode.window.setStatusBarMessage('Source ' + cSource + ' Compiled!!! :D',3000);
                });
                compile.compile(cSource);

});
return disposable;
}
function menucompilemulti()
{
   
let disposable = vscode.commands.registerCommand('advpl.menucompilemulti', function (context)  {
        
        //var editor = vscode.window.activeTextEditor;
        var cResource = context._fsPath;
        if(fs.lstatSync(cResource).isDirectory())
        {
            vscode.window.setStatusBarMessage('Starting advpl folder compiler...' + cResource,3000);
              var compile = new advplCompile(JSON.stringify(vscode.workspace.getConfiguration("advpl")),advplDiagnosticCollection, OutPutChannel);
                compile.setAfterCompileOK(function (){            
                    vscode.window.setStatusBarMessage('Folder ' + cResource + ' Compiled!!! :D',3000);
                });
                compile.compileFolder(cResource);
        }
            
        else
            vscode.window.showInformationMessage('Por favor selecione uma pasta.') ;
      /*  var compile = new advplCompile(JSON.stringify(vscode.workspace.getConfiguration("advpl")),advplDiagnosticCollection, OutPutChannel);
                compile.setAfterCompileOK(function (){
                   // vscode.window.showInformationMessage('Source ' + editor.document.fileName + ' Compiled!!! :D') ;
                    vscode.window.setStatusBarMessage('Source ' + cSource + ' Compiled!!! :D',3000);
                });
                compile.compile(cSource);*/

});
return disposable;
}

function compile()
{
   
let disposable = vscode.commands.registerCommand('advpl.compile', function (context)  {
        
        var editor = vscode.window.activeTextEditor;
        var cSource = editor.document.fileName;
        vscode.window.setStatusBarMessage('Starting advpl compile...' + editor.document.fileName,3000);
        var compile = new advplCompile(JSON.stringify(vscode.workspace.getConfiguration("advpl")),advplDiagnosticCollection, OutPutChannel);
                compile.setAfterCompileOK(function (){
                   // vscode.window.showInformationMessage('Source ' + editor.document.fileName + ' Compiled!!! :D') ;
                    vscode.window.setStatusBarMessage('Source ' + editor.document.fileName + ' Compiled!!! :D',3000);
                });
                compile.compile(cSource);

});
return disposable;
}

function addGetDebugInfosCommand()
{
let disposable = vscode.commands.registerCommand('advpl.getDebugInfos', function (context)  {
    var _jSon = vscode.workspace.getConfiguration("advpl");
    var Jstring = JSON.stringify(_jSon);  
     return Jstring;    
    });
return disposable;
}

function getAuthorizationId() 
{
let disposable = vscode.commands.registerCommand('advpl.getAuthorizationId', function (context)  {
       var compile = new advplCompile(JSON.stringify(vscode.workspace.getConfiguration("advpl")),advplDiagnosticCollection,OutPutChannel);
       compile.getHdId();
          
    });
return disposable;
}

function CipherPassword() 
{
let disposable = vscode.commands.registerCommand('advpl.CipherPassword', function (context)  {
       var compile = new advplCompile(JSON.stringify(vscode.workspace.getConfiguration("advpl")),advplDiagnosticCollection,OutPutChannel);
       compile.CipherPassword();
          
    });
return disposable;
}
/***
 * Patchs
 */
function PathSelectSource() 
{
let disposable = vscode.commands.registerCommand('advpl.patch.selectSource', function (context)  {
            vscode.window.showInformationMessage("Não implementado ainda.");
    });
return disposable;
}
function PathApply() 
{
let disposable = vscode.commands.registerCommand('advpl.patch.apply', function (context)  {
            var cResource = context._fsPath;
            if(fs.lstatSync(cResource).isFile())
            {
                var patch = new advplPatch(JSON.stringify(vscode.workspace.getConfiguration("advpl")),OutPutChannel)
                patch.apply(cResource);
                
            }
            else
            {
                vscode.window.showErrorMessage("Escolha uma arquivo PTM.");
            }
    });
return disposable;
}
function PathBuild() 
{
let disposable = vscode.commands.registerCommand('advpl.patch.build', function (context)  {         
            var patch = new advplPatch(JSON.stringify(vscode.workspace.getConfiguration("advpl")),OutPutChannel)
            if (fileToBuildPath == null )
            {
                vscode.window.showErrorMessage("Informe o arquivo texto para com os fontes para serem gerados.");
            }                
           else
           {
                if (!fs.lstatSync(fileToBuildPath).isFile())
                    vscode.window.showErrorMessage("Informe o arquivo texto para com os fontes para serem gerados.");
                else
                    patch.build(fileToBuildPath);
           }
             
    });
return disposable;
}

  
function PathSelectFolder() 
{
let disposable = vscode.commands.registerCommand('advpl.patch.selectFolder', function (context)  {
            vscode.window.showInformationMessage("Não implementado ainda.");
    });
return disposable;
}

function PathFileToBuild() 
{
let disposable = vscode.commands.registerCommand('advpl.patch.setFileToBuild', function (context)  {
            var cResource = context._fsPath;
            if(fs.lstatSync(cResource).isFile())
            {
                fileToBuildPath = cResource;
                vscode.window.showInformationMessage("O arquivo " + cResource + " foi selecionado para se a lista de fontes para patch.");
            }
            else
            {
                vscode.window.showInformationMessage("Informe um arquivo. ");
            }
    });
return disposable;
}

function GetThreads()
{
let disposable = vscode.commands.registerCommand('advpl.monitor.getThreads', function (context)  {
        var monitor = new advplMonitor(JSON.stringify(vscode.workspace.getConfiguration("advpl")),OutPutChannel)
        monitor.getThreads();
    });
return disposable;


}



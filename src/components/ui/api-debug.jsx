import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { AlertCircle, RefreshCw, Activity, Clock } from 'lucide-react';

const ApiDebug = () => {
  const [apiCalls, setApiCalls] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Interceptar chamadas fetch para monitorar
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const startTime = Date.now();
      const url = args[0];
      
      try {
        const response = await originalFetch(...args);
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        setApiCalls(prev => [
          {
            url: typeof url === 'string' ? url : url.url,
            method: args[1]?.method || 'GET',
            status: response.status,
            duration,
            timestamp: new Date().toISOString(),
            success: response.ok
          },
          ...prev.slice(0, 19) // Manter apenas as últimas 20 chamadas
        ]);
        
        return response;
      } catch (error) {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        setApiCalls(prev => [
          {
            url: typeof url === 'string' ? url : url.url,
            method: args[1]?.method || 'GET',
            status: 'ERROR',
            duration,
            timestamp: new Date().toISOString(),
            success: false,
            error: error.message
          },
          ...prev.slice(0, 19)
        ]);
        
        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const clearCalls = () => {
    setApiCalls([]);
  };

  const getStatusColor = (status) => {
    if (status === 'ERROR') return 'destructive';
    if (status >= 200 && status < 300) return 'default';
    if (status >= 400 && status < 500) return 'secondary';
    return 'outline';
  };

  const formatDuration = (duration) => {
    if (duration < 100) return `${duration}ms`;
    return `${(duration / 1000).toFixed(1)}s`;
  };

  const getDuplicateCalls = () => {
    const duplicates = {};
    apiCalls.forEach(call => {
      const key = `${call.method} ${call.url}`;
      if (!duplicates[key]) {
        duplicates[key] = [];
      }
      duplicates[key].push(call);
    });
    
    return Object.entries(duplicates)
      .filter(([_, calls]) => calls.length > 1)
      .map(([key, calls]) => ({
        endpoint: key,
        count: calls.length,
        calls
      }));
  };

  const duplicates = getDuplicateCalls();

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          size="sm"
          variant="outline"
          className="bg-white shadow-lg"
        >
          <Activity className="h-4 w-4 mr-2" />
          API Debug ({apiCalls.length})
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-96">
      <Card className="shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              API Debug
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={clearCalls}
                size="sm"
                variant="outline"
              >
                Limpar
              </Button>
              <Button
                onClick={() => setIsVisible(false)}
                size="sm"
                variant="outline"
              >
                ✕
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 max-h-80 overflow-y-auto">
          {/* Resumo */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-gray-50 p-2 rounded">
              <div className="font-medium">Total Calls</div>
              <div>{apiCalls.length}</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="font-medium">Duplicates</div>
              <div>{duplicates.length}</div>
            </div>
          </div>

          {/* Chamadas duplicadas */}
          {duplicates.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1 text-orange-500" />
                Chamadas Duplicadas
              </h4>
              <div className="space-y-2">
                {duplicates.map(({ endpoint, count, calls }) => (
                  <div key={endpoint} className="bg-orange-50 p-2 rounded text-xs">
                    <div className="font-medium">{endpoint}</div>
                    <div className="text-orange-600">{count} chamadas</div>
                    <div className="text-gray-500">
                      Última: {formatDuration(calls[0].duration)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lista de chamadas */}
          <div>
            <h4 className="text-sm font-medium mb-2">Últimas Chamadas</h4>
            <div className="space-y-1">
              {apiCalls.slice(0, 10).map((call, index) => (
                <div key={index} className="border rounded p-2 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs truncate flex-1">
                      {call.method} {call.url.split('/').pop()}
                    </span>
                    <Badge variant={getStatusColor(call.status)} size="sm">
                      {call.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDuration(call.duration)}
                    </span>
                    <span>
                      {new Date(call.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiDebug; 

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Asset } from '@/types';
import { simulatedAssets } from '@/data/simulatedNetwork';

export const useAssetsWithBills = () => {
  return useQuery({
    queryKey: ['assets-with-bills'],
    queryFn: async (): Promise<Asset[]> => {
      console.log('Fetching assets with bills data...');
      
      // Get all assets from database
      const { data: dbAssets, error: assetsError } = await supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: true });

      if (assetsError) {
        console.error('Error fetching assets:', assetsError);
        throw assetsError;
      }

      console.log('Database assets fetched:', dbAssets?.length || 0);
      console.log('Simulated assets available:', simulatedAssets.length);

      // Process database assets with bills for tap assets
      const dbAssetsWithBills = await Promise.all(
        (dbAssets || []).map(async (asset) => {
          // Convert the asset to match our Asset interface
          const formattedAsset: Asset = {
            ...asset,
            specifications: asset.specifications as Record<string, any> || undefined
          };

          if (asset.type === 'tap') {
            try {
              // Get water connection for this tap
              const { data: connection, error: connectionError } = await supabase
                .from('water_connections')
                .select('*')
                .eq('tap_asset_id', asset.id)
                .maybeSingle();

              if (connectionError) {
                console.error('Error fetching water connection for asset', asset.id, connectionError);
              }

              if (connection) {
                // Get current bill for this connection
                const currentMonth = new Date().getMonth() + 1;
                const currentYear = new Date().getFullYear();
                
                const { data: bill, error: billError } = await supabase
                  .from('water_bills')
                  .select('*')
                  .eq('water_connection_id', connection.id)
                  .eq('bill_month', currentMonth)
                  .eq('bill_year', currentYear)
                  .maybeSingle();

                if (billError) {
                  console.error('Error fetching bill for connection', connection.id, billError);
                }

                console.log(`Tap ${asset.name} - Connection: ${connection.water_id}, Bill: ${bill?.id || 'None'}`);

                return {
                  ...formattedAsset,
                  water_connection: connection,
                  current_bill: bill || undefined
                };
              }
            } catch (error) {
              console.error('Error processing tap asset', asset.id, error);
            }
          }
          
          return formattedAsset;
        })
      );

      // Combine database assets with simulated network assets
      // Remove any simulated assets that have the same ID as database assets to avoid duplicates
      const dbAssetIds = new Set((dbAssets || []).map(asset => asset.id));
      const filteredSimulatedAssets = simulatedAssets.filter(asset => !dbAssetIds.has(asset.id));
      
      const allAssets = [...dbAssetsWithBills, ...filteredSimulatedAssets];
      
      console.log(`Total assets: ${allAssets.length} (${dbAssetsWithBills.length} from DB + ${filteredSimulatedAssets.length} simulated)`);
      
      return allAssets;
    },
    refetchInterval: 30000, // Refetch every 30 seconds to get updated data
  });
};

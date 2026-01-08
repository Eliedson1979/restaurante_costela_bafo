import { supabase } from '../utils/supabase';

export class ProductModel {
    static async getAll() {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error('Erro ao buscar produtos:', error);
            return [];
        }

        return data;
    }

    static async getProductsByCategory(category) {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('category', category)
            .order('id', { ascending: true });

        if (error) {
            console.error(`Erro ao buscar produtos da categoria ${category}:`, error);
            return [];
        }

        return data;
    }

    static async getById(id) {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error(`Erro ao buscar produto ${id}:`, error);
            return null;
        }

        return data;
    }

    static async getBestSellers() {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_best_seller', true);

        if (error) {
            console.error('Erro ao buscar destaques:', error);
            return [];
        }

        return data;
    }

    static async create(productData) {
        const { data, error } = await supabase
            .from('products')
            .insert([productData])
            .select()
            .single();

        if (error) {
            console.error('Erro ao criar produto:', error);
            throw error;
        }

        return data;
    }

    static async update(id, productData) {
        const { data, error } = await supabase
            .from('products')
            .update(productData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error(`Erro ao atualizar produto ${id}:`, error);
            throw error;
        }

        return data;
    }

    static async delete(id) {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            console.error(`Erro ao excluir produto ${id}:`, error);
            throw error;
        }

        return true;
    }
}
